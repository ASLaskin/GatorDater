import { HelpCircle, Settings, User, LogOut } from "lucide-react";
import { auth } from "@/server/auth";
import SignOut from "@/components/sign-out";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

const Header: React.FC = async () => {
  const session = await auth();

  return (
    <header className="flex justify-between items-center p-4 border-b">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold">GatorDater</h1>
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </div>

      {/* User Actions */}
      {session?.user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {session.user.email || "My Account"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
             <Link href="/Profile">
            <DropdownMenuItem>    
                <User className="mr-2 h-4 w-4" />
                Profile
            </DropdownMenuItem>
            </Link>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Preferences
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <SignOut />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button>Sign In</Button>
      )}
    </header>
  );
};

export default Header;
