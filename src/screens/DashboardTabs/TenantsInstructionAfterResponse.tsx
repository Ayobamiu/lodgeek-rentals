export function TenantsInstructionAfterResponse() {
  return (
    <>
      {/* Tenant's info before decision is made */}
      <div className="text-xs font-medium text-yellow-500 my-5 text-justify p-3 border border-yellow-200 rounded-lg bg-yellow-50 dark:bg-yellow-600 dark:border-yellow-500 dark:text-yellow-300">
        Thank you for submitting your response to the rent review request.
        Please note that the property management team will consider your
        response and make a decision on whether to increase or not increase your
        rent. You will be notified of the decision here as soon as it is made.
        We appreciate your patience and understanding.
      </div>
    </>
  );
}
