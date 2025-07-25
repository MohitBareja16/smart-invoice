export const metadata = {
  title: 'Smart Invoice Generator',
  description: 'Create professional invoices with ease',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">
              💡 Smart Invoice Generator
            </h1>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
