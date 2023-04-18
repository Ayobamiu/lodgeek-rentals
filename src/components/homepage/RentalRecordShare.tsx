import React, { useState } from "react";
import styled from "styled-components";
import Input from "../shared/input/Input";
import Button from "../shared/button/Button";
import SingleUserAccess from "../rental/SingleUserAccess";

const RentalRecordShare = ({
  divRef,
}: {
  divRef:
    | ((instance: HTMLDivElement | null) => void)
    | React.RefObject<HTMLDivElement>
    | null
    | undefined;
}) => {
  const [email, setEmail] = useState("");
  return (
    <Container
      ref={divRef}
      className="absolute right-0 -bottom-64 w-full lg:w-[75%] bg-white rounded-sm h-[250px] z-[100] "
    >
      {/* Header */}
      <div className="w-full border-b border-b-gray-200 px-4 py-2">
        <p className="text-sm text-gray-500 font-medium ">
          Share rental record
        </p>
      </div>
      {/* Content */}
      <div className="w-full px-4 py-5">
        <form className="w-full flex flex-row items-center ">
          <Input
            value={email}
            onChange={(val: string) => setEmail(val)}
            className="w-[90%]"
            placeholder="Partner email..."
          />
          <Button title="Invite" type={"submit"} className="w-[20%]" />
        </form>
        {/* uSERS */}
        <div className="w-full mt-5">
          <SingleUserAccess email="lasisikehinde153@gmail.com" />
          <SingleUserAccess email="lasisikehinde153@gmail.com" />
        </div>
      </div>
    </Container>
  );
};

export default RentalRecordShare;

const Container = styled.div`
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`;
