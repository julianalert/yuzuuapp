'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "./logo";
import Dropdown from "@/components/dropdown";
import MobileMenu from "./mobile-menu";
import { useAuth } from "@/lib/auth-context";

export default function DashboardHeader() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="fixed top-2 z-30 w-full md:top-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-white/90 px-3 shadow-lg shadow-black/[0.03] backdrop-blur-xs before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(var(--color-gray-100),var(--color-gray-200))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]">
          {/* Site branding */}
          <div className="flex flex-1 items-center">
            <Logo />
          </div>

          {/* Navigation and buttons */}
          <ul className="flex items-center gap-3">
            {/*<li className="px-3 py-1">
              <Link
                href="/dashboard"
                className="flex items-center text-gray-700 transition hover:text-gray-900"
              >
                Settings
              </Link>
            </li> */}
            <li className="px-3 py-1">
              <button
                onClick={handleSignOut}
                className="flex items-center text-gray-700 transition hover:text-gray-900 cursor-pointer"
              >
                Sign Out
              </button>
            </li>
          </ul>

          {/*<MobileMenu />*/}
        </div>
      </div>
    </header>
  );
} 