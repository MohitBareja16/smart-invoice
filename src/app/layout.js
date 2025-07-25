import Link from 'next/link';

export const metadata = {
  title: 'Smart Invoice Generator',
  description: 'Create professional invoices with ease',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              💡 Smart Invoice Generator
            </h1>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link href="/" className="text-blue-600 hover:text-blue-800">
                    Create Invoice
                  </Link>
                </li>
                <li>
                  <Link href="/invoices" className="text-blue-600 hover:text-blue-800">
                    View Invoices
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
