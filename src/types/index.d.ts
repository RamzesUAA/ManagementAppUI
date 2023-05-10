declare type ButtonStyle = "light" | "primary" | "danger" | "dark";

declare type LocationType = {
  id: string;
  name: string;
  organization_id: string;
  location?: any;
  type: string;
  address: string;
};

declare type FieldType = {
  id: string;
  label: string;
  name: string;
  options: string;
  type: string;
};

declare type FormType = {
  id: string;
  label: string;
  name: string;
  fields: { schema: FieldType[] & { value: any } };
};

declare type EntityData = {
  id: string;
  field_id: string;
  value: string;
};

declare type EntityType = {
  id: string;
  label?: string;
  form_type_id?: string;
  name: string;
  data: { records: EntityData[] };
};

interface ExtendedField extends FieldType, EntityData {}

interface EntityWithType {
  data: {
    records: ExtendedField[];
  };
  id: string;
  label?: string;
  form_type_id?: string;
  name: string;
}

declare type _WorkerType = {
  id: string;
  name: string;
  organization_id: string;
  locations?: LocationType[];
  position?: any;
  email: string;
  responsibility?: string;
  description?: string;
};

declare type LFC<T> = (props: T) => JSX.Element;
