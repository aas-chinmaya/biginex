import "./globals.css";

import type { Metadata } from "next";
import { Saira, Geist } from "next/font/google";

import ToastProvider from "@/providers/ToastProvider";
import ReduxProvider from "@/providers/ReduxProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


// import ThemeProvider from "@/providers/ThemeProvider";


const saira = Saira({
  subsets: ["latin"],
  variable: "--font-saira",
});


export const metadata: Metadata = {
  title: "Biznex ERP",
  description:
    "Business management software for retail, grocery, pharmacy and more.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>

      <body
        className={`${saira.variable} antialiased`}
      >

        {/* Redux */}
        
        <ReduxProvider>

          {/* Theme */}
          
          <TooltipProvider>
         

            <ToastProvider>

              {children}

            </ToastProvider>

          </TooltipProvider>
        
        </ReduxProvider>
       
      </body>

    </html>
  );
}