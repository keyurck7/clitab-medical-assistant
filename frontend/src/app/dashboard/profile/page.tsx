import EditPatientForm from "@/components/EditpatientForm";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Patient Profile</h1>
        <p className="text-gray-600 mt-1">
          View and update your personal and medical profile information.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <EditPatientForm patient={{
                  date_of_birth: "",
                  blood_group: "",
                  allergies: "",
                  chronic_conditions: "",
                  emergency_contact: ""
              }} token={""}/>
      </div>
    </div>
  );
}