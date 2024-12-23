"use client";
import { Provider } from "react-redux";
import { store } from "@/app/lib/redux/store";
import { ResumeForm } from "@/app/components/resumeForm/ResumeForm";
import { Resume } from "@/app/components/resume/Resume";

export default function Create() {
  console.log("storeeeee",store);
  return (
    <Provider store={store}>
      <main className="relative h-full w-full overflow-hidden bg-gray-50">
        <div className="grid grid-cols-3 md:grid-cols-6">
          <div className="col-span-3">
            <ResumeForm />
          </div>
          <div className="col-span-3">
            <Resume />
          </div>
        </div>
      </main>
    </Provider>
  );
}
