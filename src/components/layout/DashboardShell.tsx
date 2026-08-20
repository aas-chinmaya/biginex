"use client";

import { useState } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";
import Breadcrumb from "./Breadcrumb";

import Container from "@/components/common/Container";

interface Props {
  children: React.ReactNode;
}

export default function DashboardShell({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-background">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Fixed Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Area */}
      <div className="min-h-dvh lg:pl-72">
        {/* Header */}
        <Header
          sidebarOpen={sidebarOpen}
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
        />

        {/* Content */}
        <main className="min-w-0">
          <Container className="py-6">
            <Breadcrumb />

            <div className="mt-6">
              {children}
            </div>
          </Container>
        </main>
      </div>
    </div>
  );
}







// "use client";

// import { useState } from "react";

// import Sidebar from "./Sidebar";
// import Header from "./Header";
// import Breadcrumb from "./Breadcrumb";

// import Container from "@/components/common/Container";

// interface Props {
//     children: React.ReactNode;
// }

// export default function DashboardShell({
//     children,
// }: Props) {
//     const [sidebarOpen, setSidebarOpen] =
//         useState(false);

//     return (
//         <div className="flex h-dvh bg-background">
//             {/* Mobile Overlay */}
//             {sidebarOpen && (
//                 <div
//                     className="fixed inset-0 z-40 bg-black/40 lg:hidden"
//                     onClick={() => setSidebarOpen(false)}
//                 />
//             )}

//             {/* Sidebar */}
//             <Sidebar
//                 open={sidebarOpen}
//                 onClose={() => setSidebarOpen(false)}
//             />

//             {/* Main */}
//             <div className="flex min-w-0 flex-1 flex-col">
//                 <Header
//                     sidebarOpen={sidebarOpen}
//                     onMenuClick={() =>
//                         setSidebarOpen((prev) => !prev)
//                     }
//                 />

//                 <main className="flex-1">
//                     <Container className="py-6">
//                         <Breadcrumb />

//                         <div className="mt-6">
//                             {children}
//                         </div>
//                     </Container>
//                 </main>
//             </div>
//         </div>
//     );
// }