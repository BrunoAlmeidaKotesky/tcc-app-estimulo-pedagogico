'use clinet';

import { useFieldArray, useFormContext } from "react-hook-form";
import FormInput from "./FormInput";

export function ChildInput() {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "childs"
    });

    return (<div>
        <div style={{ overflowY: 'auto', maxHeight: 240 }}>
            {fields.map((item, index) => (
                <div key={item.id}>
                    <FormInput label={`Nome do Filho(a) ${index + 1}`} name={`childs[${index}].name`} />
                    <br />
                    <FormInput label={`Idade do Filho(a) ${index + 1}`} name={`childs[${index}].age`} type="number" />
                    <div>
                        <button
                            style={{ margin: '12px 0' }}
                            className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
                            type="button" onClick={() => remove(index)}>{`Remover Filho(a)`}</button>
                    </div>
                </div>
            ))}
        </div>
        <button
            style={{ margin: '12px 0' }}
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
            type="button" onClick={() => append({ name: "", age: null })}>
            {`Adicionar Filho(a)`}
        </button>
    </div>
    );
}
