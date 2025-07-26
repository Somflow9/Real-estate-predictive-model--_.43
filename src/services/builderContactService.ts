interface ContactRequest {
  id: string;
  propertyId: string;
  builderName: string;
  userInfo: {
    name: string;
    email: string;
    phone: string;
    message: string;
  };
  requestType: 'Site Visit' | 'Price Inquiry' | 'Documentation' | 'General Inquiry';
  status: 'Pending' | 'Contacted' | 'Scheduled' | 'Completed';
  createdAt: string;
  responseTime?: string;
  builderResponse?: string;
}

interface BuilderContact {
  name: string;
  designation: string;
  phone: string;
  email: string;
  whatsapp?: string;
  availability: {
    days: string[];
    hours: string;
  };
  languages: string[];
  specialization: string[];
}

export class BuilderContactService {
  private contactsKey = 'brickmatrix_contacts';

  async contactBuilder(request: {
    propertyId: string;
    builderName: string;
    userInfo: {
      name: string;
      email: string;
      phone: string;
      message: string;
    };
    requestType: 'Site Visit' | 'Price Inquiry' | 'Documentation' | 'General Inquiry';
  }): Promise<{ success: boolean; message: string; contactId?: string }> {
    
    console.log(`📞 Initiating contact with ${request.builderName}...`);
    
    try {
      // Validate input
      if (!this.validateContactRequest(request)) {
        return { success: false, message: 'Please fill all required fields' };
      }

      // Simulate API call to builder's CRM system
      await new Promise(resolve => setTimeout(resolve, 1500));

      const contactRequest: ContactRequest = {
        id: `contact_${Date.now()}`,
        propertyId: request.propertyId,
        builderName: request.builderName,
        userInfo: request.userInfo,
        requestType: request.requestType,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };

      // Store contact request
      this.saveContactRequest(contactRequest);

      // Simulate different response scenarios
      const responseScenarios = [
        { success: true, message: 'Builder will contact you within 2 hours', probability: 0.7 },
        { success: true, message: 'Site visit scheduled for tomorrow 11 AM', probability: 0.2 },
        { success: false, message: 'Builder currently unavailable. Try again later.', probability: 0.1 }
      ];

      const random = Math.random();
      let cumulative = 0;
      
      for (const scenario of responseScenarios) {
        cumulative += scenario.probability;
        if (random <= cumulative) {
          if (scenario.success) {
            // Simulate builder response after delay
            setTimeout(() => {
              this.simulateBuilderResponse(contactRequest.id);
            }, 3000);
          }
          
          return {
            success: scenario.success,
            message: scenario.message,
            contactId: contactRequest.id
          };
        }
      }

      return { success: true, message: 'Contact request submitted successfully', contactId: contactRequest.id };

    } catch (error) {
      console.error('Error contacting builder:', error);
      return { success: false, message: 'Failed to contact builder. Please try again.' };
    }
  }

  async getBuilderContacts(builderName: string): Promise<BuilderContact[]> {
    console.log(`📋 Fetching contact information for ${builderName}...`);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock builder contacts based on builder name
    const contacts: BuilderContact[] = [
      {
        name: 'Rajesh Kumar',
        designation: 'Sales Manager',
        phone: '+91-98765-43210',
        email: 'rajesh.kumar@builder.com',
        whatsapp: '+91-98765-43210',
        availability: {
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          hours: '9:00 AM - 7:00 PM'
        },
        languages: ['English', 'Hindi'],
        specialization: ['Residential Sales', 'Investment Properties']
      },
      {
        name: 'Priya Sharma',
        designation: 'Customer Relations Executive',
        phone: '+91-98765-43211',
        email: 'priya.sharma@builder.com',
        whatsapp: '+91-98765-43211',
        availability: {
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          hours: '10:00 AM - 6:00 PM'
        },
        languages: ['English', 'Hindi', 'Punjabi'],
        specialization: ['Customer Support', 'Documentation', 'After Sales Service']
      }
    ];

    return contacts;
  }

  async scheduleCallback(contactId: string, preferredTime: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`📅 Scheduling callback for contact ${contactId} at ${preferredTime}...`);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update contact request with callback schedule
      const contacts = this.getContactRequests();
      const contactIndex = contacts.findIndex(c => c.id === contactId);
      
      if (contactIndex !== -1) {
        contacts[contactIndex].status = 'Scheduled';
        contacts[contactIndex].responseTime = preferredTime;
        this.saveContactRequests(contacts);
        
        return { success: true, message: `Callback scheduled for ${preferredTime}` };
      }
      
      return { success: false, message: 'Contact request not found' };
    } catch (error) {
      console.error('Error scheduling callback:', error);
      return { success: false, message: 'Failed to schedule callback' };
    }
  }

  getContactRequests(): ContactRequest[] {
    try {
      const stored = localStorage.getItem(this.contactsKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting contact requests:', error);
      return [];
    }
  }

  getContactStatus(contactId: string): ContactRequest | null {
    const contacts = this.getContactRequests();
    return contacts.find(c => c.id === contactId) || null;
  }

  private validateContactRequest(request: any): boolean {
    return !!(
      request.userInfo.name &&
      request.userInfo.email &&
      request.userInfo.phone &&
      request.userInfo.message &&
      request.requestType &&
      request.builderName
    );
  }

  private saveContactRequest(request: ContactRequest): void {
    const contacts = this.getContactRequests();
    contacts.push(request);
    this.saveContactRequests(contacts);
  }

  private saveContactRequests(contacts: ContactRequest[]): void {
    localStorage.setItem(this.contactsKey, JSON.stringify(contacts));
  }

  private simulateBuilderResponse(contactId: string): void {
    const contacts = this.getContactRequests();
    const contactIndex = contacts.findIndex(c => c.id === contactId);
    
    if (contactIndex !== -1) {
      contacts[contactIndex].status = 'Contacted';
      contacts[contactIndex].responseTime = new Date().toISOString();
      contacts[contactIndex].builderResponse = 'Thank you for your interest. Our sales executive will call you shortly to discuss the property details and arrange a site visit.';
      
      this.saveContactRequests(contacts);
      
      // Trigger notification if there's a callback mechanism
      if (typeof window !== 'undefined' && 'Notification' in window) {
        new Notification('Builder Response', {
          body: 'Builder has responded to your inquiry!',
          icon: '/favicon.ico'
        });
      }
    }
  }

  // Analytics and reporting
  getContactStats() {
    const contacts = this.getContactRequests();
    
    return {
      totalContacts: contacts.length,
      pendingContacts: contacts.filter(c => c.status === 'Pending').length,
      completedContacts: contacts.filter(c => c.status === 'Completed').length,
      averageResponseTime: this.calculateAverageResponseTime(contacts),
      topBuilders: this.getTopContactedBuilders(contacts),
      requestTypes: this.getRequestTypeBreakdown(contacts)
    };
  }

  private calculateAverageResponseTime(contacts: ContactRequest[]): number {
    const respondedContacts = contacts.filter(c => c.responseTime);
    if (respondedContacts.length === 0) return 0;
    
    const totalTime = respondedContacts.reduce((sum, contact) => {
      const created = new Date(contact.createdAt).getTime();
      const responded = new Date(contact.responseTime!).getTime();
      return sum + (responded - created);
    }, 0);
    
    return Math.round(totalTime / respondedContacts.length / (1000 * 60 * 60)); // Hours
  }

  private getTopContactedBuilders(contacts: ContactRequest[]): Array<{ builder: string; count: number }> {
    const builderCounts = contacts.reduce((acc, contact) => {
      acc[contact.builderName] = (acc[contact.builderName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(builderCounts)
      .map(([builder, count]) => ({ builder, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private getRequestTypeBreakdown(contacts: ContactRequest[]): Array<{ type: string; count: number }> {
    const typeCounts = contacts.reduce((acc, contact) => {
      acc[contact.requestType] = (acc[contact.requestType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(typeCounts)
      .map(([type, count]) => ({ type, count }));
  }
}

export const builderContactService = new BuilderContactService();