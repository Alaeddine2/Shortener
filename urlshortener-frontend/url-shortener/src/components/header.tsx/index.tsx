"use client";
import { Routes } from "@/constants/enums";
import Link from "../link";
import Navbar from "./Navbar";
import { useState } from "react";

function Header() {
    const [isLoggedIn] = useState(true);
    const [userInfo] = useState({
        name: "User",
    });
    
    return (
        <header className="py-4 md:py-6">
            <div className="container flex items-center justify-between">
                <Link href={Routes.ROOT} className="text-primary font-semibold text-2xl">URLShortener</Link>
                <Navbar isLoggedIn={isLoggedIn} userInfo={userInfo} />
            </div>
        </header>
    );
}

export default Header;