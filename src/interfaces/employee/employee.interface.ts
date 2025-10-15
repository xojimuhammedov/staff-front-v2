export interface IEmployee {
  id: string;
  firstName: string;
  lastName: string;
  lastSeen: Date | string;
  fullName?: string;
  position: string;
  email: string;
  hostname: string;
  hostName: string;
  ipAddress: string;
  macAddress: string;
  phoneNumber: string;
  image: string;
  status?: boolean;
  createdAt: Date;
  isOnline: boolean;
  isSelected?: boolean;
  isAgentInstalled: boolean;
  lastComputer: {
    pcname: null;
    ipAddress: null | string;
    macAddress: null;
    agentVersion: null | string;
  };
  department: string;
  showDetail: boolean;
  agentVersion: string;
  disabled?: boolean;
  sub: any[];
}
