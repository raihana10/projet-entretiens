const Interview = require('../models/Interview');

class PriorityService {
  // Calculate priority based on student type and opportunity type
  static calculatePriority(studentType, opportunityType, isCommitteeMember = false) {
    let priority = 1;

    // Committee members get highest priority
    if (isCommitteeMember) {
      priority += 100;
    }

    // ENSA students get higher priority than externals
    if (studentType === 'ENSA') {
      priority += 50;
    }

    // Opportunity type priority
    switch (opportunityType) {
      case 'PFA':
      case 'PFE':
        priority += 30;
        break;
      case 'emploi':
        priority += 20;
        break;
      case 'stage_observation':
        priority += 10;
        break;
      default:
        priority += 5;
    }

    return priority;
  }

  // Check for time conflicts
  static async checkTimeConflicts(studentId, companyId, scheduledTime, estimatedDuration) {
    const startTime = new Date(scheduledTime);
    const endTime = new Date(startTime.getTime() + estimatedDuration * 60000);

    const conflicts = await Interview.find({
      studentId,
      status: { $in: ['scheduled', 'waiting', 'in_progress'] },
      $or: [
        {
          scheduledTime: { $lt: endTime },
          $expr: {
            $gte: {
              $add: ['$scheduledTime', { $multiply: ['$estimatedDuration', 60000] }]
            },
            startTime
          }
        }
      ]
    });

    return conflicts;
  }

  // Resolve conflicts by adjusting schedules
  static async resolveConflicts(interviewId) {
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      throw new Error('Interview not found');
    }

    const conflicts = await this.checkTimeConflicts(
      interview.studentId,
      interview.companyId,
      interview.scheduledTime,
      interview.estimatedDuration
    );

    if (conflicts.length > 0) {
      // Find the next available time slot
      const nextAvailableTime = await this.findNextAvailableTime(
        interview.studentId,
        interview.companyId,
        interview.scheduledTime,
        interview.estimatedDuration
      );

      if (nextAvailableTime) {
        interview.scheduledTime = nextAvailableTime;
        interview.conflicts.push({
          type: 'time_conflict',
          description: 'Resolved by rescheduling',
          resolved: true,
          resolvedAt: new Date()
        });

        await interview.save();
        return { resolved: true, newTime: nextAvailableTime };
      }
    }

    return { resolved: false };
  }

  // Find next available time slot
  static async findNextAvailableTime(studentId, companyId, startTime, duration) {
    const timeSlots = [];
    const slotDuration = 15; // 15-minute slots
    const maxSlots = 48; // 12 hours worth of slots

    for (let i = 1; i <= maxSlots; i++) {
      const proposedTime = new Date(startTime.getTime() + i * slotDuration * 60000);
      
      const conflicts = await this.checkTimeConflicts(
        studentId,
        companyId,
        proposedTime,
        duration
      );

      if (conflicts.length === 0) {
        return proposedTime;
      }
    }

    return null; // No available time found
  }

  // Optimize queue order based on priorities
  static async optimizeQueue(companyId) {
    const interviews = await Interview.findByCompany(companyId, 'waiting');
    
    // Sort by priority (highest first)
    interviews.sort((a, b) => b.priority - a.priority);

    // Update positions
    for (let i = 0; i < interviews.length; i++) {
      interviews[i].position = i + 1;
      await interviews[i].save();
    }

    return interviews;
  }

  // Get queue statistics
  static async getQueueStats(companyId) {
    const interviews = await Interview.findByCompany(companyId, 'waiting');
    
    const stats = {
      totalWaiting: interviews.length,
      averageWaitTime: 0,
      priorityDistribution: {
        high: 0,
        medium: 0,
        low: 0
      },
      opportunityTypeDistribution: {
        PFA: 0,
        PFE: 0,
        emploi: 0,
        stage_observation: 0
      }
    };

    let totalWaitTime = 0;
    let waitTimeCount = 0;

    interviews.forEach(interview => {
      // Calculate wait time
      if (interview.scheduledTime) {
        const waitTime = Math.floor((Date.now() - interview.scheduledTime) / 1000 / 60);
        totalWaitTime += waitTime;
        waitTimeCount++;
      }

      // Priority distribution
      if (interview.priority >= 80) {
        stats.priorityDistribution.high++;
      } else if (interview.priority >= 50) {
        stats.priorityDistribution.medium++;
      } else {
        stats.priorityDistribution.low++;
      }

      // Opportunity type distribution
      stats.opportunityTypeDistribution[interview.opportunityType]++;
    });

    if (waitTimeCount > 0) {
      stats.averageWaitTime = Math.floor(totalWaitTime / waitTimeCount);
    }

    return stats;
  }

  // Check if student can be scheduled for multiple companies
  static async checkStudentAvailability(studentId, timeRange) {
    const { startTime, endTime } = timeRange;
    
    const existingInterviews = await Interview.find({
      studentId,
      status: { $in: ['scheduled', 'waiting', 'in_progress'] },
      $or: [
        {
          scheduledTime: { $lt: endTime },
          $expr: {
            $gte: {
              $add: ['$scheduledTime', { $multiply: ['$estimatedDuration', 60000] }]
            },
            startTime
          }
        }
      ]
    });

    return {
      available: existingInterviews.length === 0,
      conflicts: existingInterviews
    };
  }

  // Generate optimal schedule for a student
  static async generateOptimalSchedule(studentId, registrations) {
    const schedule = [];
    const timeSlots = this.generateTimeSlots();

    for (const registration of registrations) {
      const availableSlots = timeSlots.filter(slot => {
        return this.isSlotAvailable(studentId, registration.companyId, slot);
      });

      if (availableSlots.length > 0) {
        const optimalSlot = this.selectOptimalSlot(availableSlots, registration.priority);
        schedule.push({
          ...registration,
          scheduledTime: optimalSlot
        });
      }
    }

    return schedule;
  }

  // Generate time slots for the day
  static generateTimeSlots() {
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    const slotDuration = 15; // 15 minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const time = new Date();
        time.setHours(hour, minute, 0, 0);
        slots.push(time);
      }
    }

    return slots;
  }

  // Check if a time slot is available
  static async isSlotAvailable(studentId, companyId, slot) {
    const conflicts = await this.checkTimeConflicts(studentId, companyId, slot, 15);
    return conflicts.length === 0;
  }

  // Select optimal slot based on priority
  static selectOptimalSlot(availableSlots, priority) {
    // Higher priority gets earlier slots
    const sortedSlots = availableSlots.sort((a, b) => a - b);
    
    if (priority >= 80) {
      return sortedSlots[0]; // First available slot for high priority
    } else if (priority >= 50) {
      return sortedSlots[Math.floor(sortedSlots.length / 2)]; // Middle slot for medium priority
    } else {
      return sortedSlots[sortedSlots.length - 1]; // Last available slot for low priority
    }
  }
}

module.exports = PriorityService; 