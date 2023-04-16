export function InstructionOnRejection() {
  return (
    <>
      {/* Instruction when rent increase is rejected */}
      <div className="p-3 text-xs font-normal text-red-500 border border-red-200 rounded-lg bg-red-50 dark:bg-red-600 dark:border-red-500 dark:text-red-300">
        The proposed rent increase has been rejected. As a result, the current
        rent amount will continue and the existing lease agreement will remain
        in effect. We appreciate your prompt response to the rent review and
        encourage you to contact us if you have any questions or concerns.
      </div>
    </>
  );
}
