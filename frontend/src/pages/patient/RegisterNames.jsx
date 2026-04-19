import React, { useState } from "react";
import Input from "../../components/Input";


const RegisterNames = () => {
  const [firstName, setFirstName] = useState("");
  const [surName, setSurName] = useState("");
  const [lastName, setLastName] = useState("");

  const fullName = `${firstName} ${surName} ${lastName}`;
  return (
    <div className="flex flex-col gap-5 w-[70%] mx-auto">
      <h2 className="text-2xl font-bold mb-3">Filling Patient Names</h2>
      <Input
        label="First Name"
        placeholder="John"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <Input
        label="Sur Name"
        placeholder="Smith"
        value={surName}
        onChange={(e) => setSurName(e.target.value)}
        required
      />

      <Input
        label="Last Name"
        placeholder="Doe"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
    </div>
  );
};

export default RegisterNames;
