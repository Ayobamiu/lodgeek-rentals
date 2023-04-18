type Props = {
  name: string;
  photoURL?: string;
  size?: "2" | "4" | "6" | "8" | "10";
};

export function ProfilePhoto(props: Props): JSX.Element {
  const { name, photoURL, size } = props;
  const initials = `${name[0] || "-"}${name[1] || "-"}`;
  return (
    <div
      title={name}
      className={`rounded-full bg-gray-100 w-${size || "8"} h-${
        size || "8"
      } flex justify-center items-center border dark:border-gray-600 uppercase`}
    >
      {photoURL ? <img src={photoURL} alt="" /> : initials}
    </div>
  );
}
