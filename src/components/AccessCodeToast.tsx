"use client";

type AccessCodeToastProps = {
  codes: {
    accessCode: string;
    name: string;
  }[];
  onClose: () => void;
};
export function AccessCodeToast({ codes, onClose }: AccessCodeToastProps) {
  return (
    <div style={{ gap: 8, display: "grid" }}>
      <strong>Códigos de acesso</strong>
      <label>
        Você deve copiar estes valores, pois não serão exibidos novamente.
      </label>
      <ul>
        {codes.map(({ accessCode, name }) => (
          <li key={accessCode}>
            <div style={{ display: "flex", gap: 8 }}>
              <strong>{accessCode}</strong>-<span>{name}</span>
            </div>
          </li>
        ))}
      </ul>
      <button
        className="w-full py-3 font-semibold rounded-lg outline-none border-none flex justify-center text-green-600"
        onClick={onClose}
      >
        Fechar
      </button>
    </div>
  );
}
