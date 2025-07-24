type Choice = {
  name: string;
  value: any;
};

type Option = {
  name: string;
  description: string;
  type: number;
  required?: boolean;
  choices?: readonly Choice[];
};

type Command = {
  name: string;
  description: string;
  options?: readonly Option[];
  dmPermission?: boolean | null;
};

export default function areCommandsDifferent(existingCommand: Command, localCommand: Command): boolean {
  const areChoicesDifferent = (existingChoices: readonly Choice[] = [], localChoices: readonly Choice[] = []): boolean => {
    for (const localChoice of localChoices) {
      const existingChoice = existingChoices.find((choice) => choice.name === localChoice.name);

      if (!existingChoice || localChoice.value !== existingChoice.value) {
        return true;
      }
    }
    return false;
  };

  const areOptionsDifferent = (existingOptions: readonly Option[] = [], localOptions: readonly Option[] = []): boolean => {
    for (const localOption of localOptions) {
      const existingOption = existingOptions.find((option) => option.name === localOption.name);

      if (
        !existingOption ||
        localOption.description !== existingOption.description ||
        localOption.type !== existingOption.type ||
        (localOption.required ?? false) !== existingOption.required ||
        (localOption.choices?.length ?? 0) !== (existingOption.choices?.length ?? 0) ||
        areChoicesDifferent(existingOption.choices, localOption.choices)
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    existingCommand.description !== localCommand.description ||
    (existingCommand.options?.length ?? 0) !== (localCommand.options?.length ?? 0) ||
    areOptionsDifferent(existingCommand.options, localCommand.options) ||
    existingCommand.dmPermission !== localCommand.dmPermission
  );
}
