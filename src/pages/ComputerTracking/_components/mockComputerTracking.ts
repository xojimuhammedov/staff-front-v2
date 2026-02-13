export interface IComputerTrackingItem {
  computerName: string;
  location?: string; // masalan: "3-qavat, 301-xona"
  model: string;
  status: 'active' | 'inactive';
  ipAddress: string;
  inventoryNumber: string;
  employee?: {
    name: string;
    photo?: string;
  };
}

export const MOCK_COMPUTER_TRACKING: IComputerTrackingItem[] = [
  {
    computerName: 'DEV-WORKSTATION-01',
    location: '3-qavat, 301-xona',
    model: 'Dell OptiPlex 7090',
    status: 'active',
    ipAddress: '192.168.1.101',
    inventoryNumber: 'INV-2024-001',
    employee: { name: 'Ali Valiyev' },
  },
  {
    computerName: 'DESIGN-MAC-01',
    location: '2-qavat, 205-xona',
    model: 'Apple iMac 24"',
    status: 'active',
    ipAddress: '192.168.1.102',
    inventoryNumber: 'INV-2024-002',
    employee: { name: 'Dilnoza Karimova' },
  },
  {
    computerName: 'LAPTOP-DEV003',
    location: '1-qavat, 102-xona',
    model: 'Lenovo ThinkPad E14',
    status: 'inactive',
    ipAddress: '192.168.1.103',
    inventoryNumber: 'INV-2024-003',
    employee: { name: 'Sardor Rahimov' },
  },
  {
    computerName: 'WORKSTATION-004',
    location: '3-qavat, 304-xona',
    model: 'Dell Precision 3650',
    status: 'active',
    ipAddress: '192.168.1.104',
    inventoryNumber: 'INV-2024-004',
    employee: { name: 'Malika Toshmatova' },
  },
  {
    computerName: 'PC-HR-005',
    location: '2-qavat, 201-xona',
    model: 'HP ProDesk 400 G7',
    status: 'active',
    ipAddress: '192.168.1.105',
    inventoryNumber: 'INV-2024-005',
    employee: { name: 'Jasur Bekmurodov' },
  },
  {
    computerName: 'DESKTOP-SALES-006',
    location: '1-qavat, 105-xona',
    model: 'Lenovo IdeaCentre 5',
    status: 'inactive',
    ipAddress: '192.168.1.106',
    inventoryNumber: 'INV-2024-006',
    employee: { name: 'Nilufar Usmanova' },
  },
  {
    computerName: 'DEV-MAC-007',
    location: '2-qavat, 208-xona',
    model: 'Apple iMac 24"',
    status: 'active',
    ipAddress: '192.168.1.107',
    inventoryNumber: 'INV-2024-007',
    employee: { name: 'Bobur Ismoilov' },
  },
  {
    computerName: 'DESKTOP-008',
    location: '3-qavat, 310-xona',
    model: 'Acer Veriton N4660G',
    status: 'active',
    ipAddress: '192.168.1.108',
    inventoryNumber: 'INV-2024-008',
    employee: { name: 'Gulnora Rashidova' },
  },
];

export const MOCK_PAGINATION = {
  data: MOCK_COMPUTER_TRACKING,
  total: MOCK_COMPUTER_TRACKING.length,
  page: 1,
  limit: 10,
};
