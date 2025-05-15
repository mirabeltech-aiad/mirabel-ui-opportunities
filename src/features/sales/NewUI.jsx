import React,{useState} from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Popover as DatePickerPopover } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const DashboardDemoPage = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="container p-8 mx-auto space-y-12 bg-background text-foreground">
      {/* Buttons Section */}
      <section className="space-y-4">
        <h2 className="pb-2 text-2xl font-bold border-b">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      {/* Inputs Section */}
      <section className="space-y-4">
        <h2 className="pb-2 text-2xl font-bold border-b">Inputs</h2>
        <div className="grid max-w-md gap-4">
          <div className="space-y-2">
            <Label htmlFor="text">Text Input</Label>
            <Input id="text" placeholder="Enter text..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="textarea">Textarea</Label>
            <textarea
              id="textarea"
              className="flex min-h-[80px] w-full rounded-sm border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-normal"
              placeholder="Enter multiple lines..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter password..." />
          </div>
        </div>
      </section>


{/* Tooltip */}
<section className="space-y-4">
        <h2 className="pb-2 text-2xl font-bold border-b">Tooltips</h2>
        <div className="flex gap-4">
      <TooltipProvider delayDuration={300}>
        <Tooltip>
        <Button variant="outline"><TooltipTrigger>Hover</TooltipTrigger></Button>
          <TooltipContent>
            <p>A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

        </div>
      </section>


      {/* Labels and Checkboxes Section */}
      <section className="space-y-4">
        <h2 className="pb-2 text-2xl font-bold border-b">Labels and Checkboxes</h2>
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" variant="outline"/>
          <Label htmlFor="terms">Accept terms and conditions</Label>
        </div>
      </section>

      {/* Dialog and Popover Section */}
      <section className="space-y-4">
        <h2 className="pb-2 text-2xl font-bold border-b">Dialog</h2>
        <div className="flex gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>This is a dialog description.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>
      
      {/* Dropdown Menu Section */}
      <section className="space-y-4">
        <h2 className="pb-2 text-2xl font-bold border-b">Dropdown Menu</h2>
        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Open Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>
      
      {/* Navigation and Dropdown Section */}
      <section className="space-y-4">
        <h2 className="pb-2 text-2xl font-bold border-b">Navigation and Dropdown</h2>
        <div className="space-y-8">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-0 p-0 w-[400px] text-left font-normal">
                    <li>
                      <NavigationMenuLink >Documentation</NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink>Components</NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </section>

      {/* Switch Section */}
      <section className="space-y-4">
        <h2 className="pb-2 text-2xl font-bold border-b">Switch</h2>
        <div className="flex items-center gap-4">
          <Switch id="airplane-mode" />
          <Label htmlFor="airplane-mode">Airplane Mode</Label>
        </div>
      </section>
      
      {/* Cards and Tables Section */}
      <section className="space-y-4">
        <h2 className="pb-2 text-2xl font-bold border-b">Cards and Tables</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <Button>Action</Button>
            </CardFooter>
          </Card>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>John Doe</TableCell>
                <TableCell>Active</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jane Smith</TableCell>
                <TableCell>Inactive</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      
      {/* Accordion and Tabs Section */}
      <section className="space-y-4">
        <h2 className="pb-2 text-2xl font-bold border-b">Accordion and Tabs</h2>
        <div className="grid gap-8">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>
                Yes. It comes with default styles that matches the design system.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Tabs defaultValue="account">
            <TabsList>
              <TabsTrigger value="account" className="rounded-sm">Account</TabsTrigger>
              <TabsTrigger value="password" className="rounded-sm">Password</TabsTrigger>
            </TabsList>
            <div className="rounded-lg border bg-card text-card-foreground p-6">
            <TabsContent value="account">
            <div className="text-sm text-left font-normal">Account settings content</div>
            </TabsContent>
            <TabsContent value="password">
            <div className="text-sm text-left font-normal">Password settings content</div>
            </TabsContent>
            </div>
          </Tabs>
        </div>
      </section>


 {/* Skeleton Section */}
 <section className="space-y-4">
        <h2 className="pb-2 text-2xl font-bold border-b">Skeleton</h2>
        <div className="space-y-4">
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-12" />
        </div>
      </section>

      
     



     

      
    </div>
  );
};

export default DashboardDemoPage; 