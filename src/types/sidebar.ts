interface SidebarItem {
    icon: string;
    name: string;
    path: string;
    isSwitch: boolean;
    disabled?: boolean
}

export interface SidebarMenuType {
    title: string;
    stepper_title?: string;
    items: SidebarItem[];
}