import { HelpCircle, Settings, User, Settings2} from "lucide-react";
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
        <Link href="/">
          <h1 className="text-2xl font-bold">GatorDater</h1>
        </Link>
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </div>

      {/* User Actions */}
      {session?.user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {"Actions"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
             <Link href="/profile">
            <DropdownMenuItem>    
                <User className="mr-2 h-4 w-4" />
                Profile
            </DropdownMenuItem>
            </Link>
            <Link href="/preferences">
            <DropdownMenuItem>
              <Settings2 className="mr-2 h-4 w-4" />
              Preferences
            </DropdownMenuItem>
            </Link>
            <Link href="/settings">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            </Link>
            <DropdownMenuItem asChild>
              <SignOut />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <a>Sign In To Get Started</a>
      )}
    </header>
  );
};

export default Header;
