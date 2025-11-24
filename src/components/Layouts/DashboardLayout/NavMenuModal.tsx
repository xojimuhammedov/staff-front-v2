import MenuButtonIcon from "assets/icons/MenuButtonIcon";
import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import { useState } from "react";
import NavMobileMenu from "./NavMobileMenu";
import { Link } from "react-router-dom";
import LogoSvg from 'assets/icons/LogoSvg';

export function NavMenuModal() {
    const [openModal, setOpenModal] = useState(false);

    return (
        <>
            <div className="navbar-menu-button">
                <div
                    onClick={() => setOpenModal(true)}
                    className="ml-8 flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-[8px] bg-[#FFF] p-[6px] shadow-[0px_0px_0px_1px_rgba(3,7,18,0.08),0px_1px_2px_-1px_rgba(3,7,18,0.08),0px_2px_4px_0px_rgba(3,7,18,0.04)]">
                    <MenuButtonIcon />
                </div>
            </div>

            <Modal
                show={openModal}
                onClose={() => setOpenModal(false)}
                size="md"
                className="!overflow-hidden"
            >
                {/* Overlay */}
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

                {/* Drawer panel */}
                <div
                    className={`
                        fixed top-0 right-0 h-full w-[248px]
                        bg-white dark:bg-gray-800 shadow-xl
                        transform transition-transform duration-300
                        ${openModal ? "translate-x-0" : "translate-x-full"}
                    `}
                >
                    <ModalHeader>
                        <div className="flex items-center justify-between">
                            <div className="mr-5 flex h-10 w-10 items-center justify-center rounded-m border-[1px] border-border-base bg-bg-base dark:border-dark-line dark:bg-bg-dark-bg">
                                <Link to={'/'}>
                                    <LogoSvg width={24} height={24} />
                                </Link>
                            </div>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <NavMobileMenu setOpenModal={setOpenModal} />
                    </ModalBody>
                </div>
            </Modal>
        </>
    );
}
