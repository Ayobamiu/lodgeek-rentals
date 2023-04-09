type Props = {
  name: string;
  photoURL?: string;
};

export function ProfilePhoto(props: Props): JSX.Element {
  const { name, photoURL } = props;
  const initials = `${name[0] || "-"}${name[1] || "-"}`;
  return (
    <div
      title={name}
      className="rounded-full bg-gray-100 w-8 h-8 flex justify-center items-center border dark:border-gray-600 uppercase"
    >
      {photoURL ? <img src={photoURL} alt="" /> : initials}
    </div>
  );
}
