'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: 'í¿ ' },
    { name: 'Clients', href: '/dashboard/clients', icon: 'í±¥' },
    { name: 'Invoices', href: '/dashboard/invoices', icon: 'í·¾' },
  ];

  return (
    <div className="w-64 h-full border-r bg-gray-50">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Smart Invoice</h1>
      </div>
      <nav className="p-2 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={\`flex items-center p-3 rounded-md \${pathname === item.href 
              ? 'bg-blue-100 text-blue-800 font-medium' 
              : 'text-gray-700 hover:bg-gray-100'}\`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
