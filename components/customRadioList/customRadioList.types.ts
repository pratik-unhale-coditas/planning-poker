export interface CheckboxProps {
  options: { label: string; value: string }[];
  selectedOption: string;
  onChange: (selectedOption: string) => void;
  title: string;
}
