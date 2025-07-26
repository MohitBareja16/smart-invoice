import InvoiceForm from '@/components/InvoiceForm';

export default function Home() {
  return (
    <main>
      <div className="max-w-7xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Invoice
          </h1>
          <p className="text-gray-600 mt-2">
            Fill in the details below to generate your professional invoice
          </p>
        </div>
        <InvoiceForm />
      </div>
    </main>
  );
}