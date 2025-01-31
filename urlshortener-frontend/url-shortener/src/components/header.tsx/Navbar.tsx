"use client";

import { useState } from "react";
import { Routes } from "@/constants/enums";
import Link from "../link";

interface UserInfo {
    name: string;
}

interface NavbarProps {
    isLoggedIn: boolean;
    userInfo: UserInfo;
}

function Navbar({ isLoggedIn, userInfo }: NavbarProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const userInitial = userInfo.name[0].toUpperCase();

    return (
        <nav className="">
            <ul className="flex items-center space-x-6 p-4">
                {isLoggedIn ? (
                    <li className="relative">
                        <div
                            onClick={toggleDropdown}
                            className="flex items-center cursor-pointer text-gray-700 hover:text-gray-900"
                        >
                            <div className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full mr-2">
                                <span className="text-lg font-semibold">{userInitial}</span>
                            </div>
                            <span className="mr-2">{userInfo.name}</span>
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                ></path>
                            </svg>
                        </div>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                                <div className="p-4 border-b border-gray-200">
                                    <div className="font-medium text-gray-800">{userInfo.name}</div>
                                </div>
                            </div>
                        )}
                    </li>
                ) : (
                    <li>
                        <Link
                            href={Routes.LOGIN}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary"
                        >
                            Login
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;