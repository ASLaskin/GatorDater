import type React from "react"
import { HelpCircle, Settings, User, Settings2, Menu } from "lucide-react"
import { auth } from "@/server/auth"
import SignOut from "@/components/sign-out"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

const Header: React.FC = async () => {
  const session = await auth()

  const NavItems = () => (
    <>
      <Link href="/profile" className="flex items-center space-x-2 hover:bg-accent rounded-md p-2 transition-colors">
        <User className="h-4 w-4" />
        <span>Profile</span>
      </Link>
      <Link
        href="/preferences"
        className="flex items-center space-x-2 hover:bg-accent rounded-md p-2 transition-colors"
      >
        <Settings2 className="h-4 w-4" />
        <span>Preferences</span>
      </Link>
      <Link href="/settings" className="flex items-center space-x-2 hover:bg-accent rounded-md p-2 transition-colors">
        <Settings className="h-4 w-4" />
        <span>Settings</span>
      </Link>
      <SignOut />
    </>
  )

  return (
    <header className="sticky top-0 z-50 px-3 w-full border-slate-400  backdrop-blur">
      <div className="flex h-14 items-center">
        <div className="flex items-center space-x-4 md:space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold bg-blue-500 bg-clip-text text-transparent">
              GatorDater
            </h1>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>

        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {session?.user ? (
            <>
              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <SheetTitle>Navigation Menu</SheetTitle>
                  <div className="mt-6 flex flex-col space-y-3">
                    <NavItems />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Desktop Menu */}
              <div className="hidden md:flex space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-14 w-14 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                        <AvatarFallback>{session.user.name?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        {session.user.name && <p className="font-medium">{session.user.name}</p>}
                        {session.user.email && (
                          <p className="w-[200px] truncate text-sm text-muted-foreground">{session.user.email}</p>
                        )}
                      </div>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/preferences" className="flex items-center">
                        <Settings2 className="mr-2 h-4 w-4" />
                        Preferences
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <SignOut />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <Button asChild>
              <a>Sign in to see your profile</a>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header

