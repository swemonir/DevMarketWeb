import { SubmitForm } from '../components/submit/SubmitForm';
export function SubmitPage() {
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="text-center mb-10">
      <h1 className="text-3xl font-bold text-white mb-3">
        Submit Your Project
      </h1>
      <p className="text-gray-400 max-w-2xl mx-auto">
        Share your work with the community. Whether it's a web app, mobile
        app, or source code, DevNexus is the best place to showcase your
        skills.
      </p>
    </div>

    <SubmitForm />
  </div>;
}