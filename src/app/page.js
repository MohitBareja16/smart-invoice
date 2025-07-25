import InvoiceForm from '@/components/InvoiceForm';

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Create New Invoice
        </h1>
        <p className="text-gray-600 mt-2">
          Fill in the details below to generate your professional invoice
        </p>
      </div>
      <InvoiceForm />
    </main>
  );
}