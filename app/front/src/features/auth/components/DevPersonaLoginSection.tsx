import { PERSONA_MOCKS } from "@/constants/personas";
import { cn } from "@/lib/utils";
import { useDevPersonaLogin } from "../hooks/useDevPersonaLogin";

type DevPersonaLoginSectionProps = {
  redirectTo?: string;
};

export function DevPersonaLoginSection({ redirectTo }: DevPersonaLoginSectionProps) {
  const loginAsPersona = useDevPersonaLogin({ redirectTo });

  if (!import.meta.env.DEV) return null;

  return (
    <div className="mt-6 rounded-lg border border-dashed border-amber-300 bg-amber-50/50 p-4">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
        Desenvolvimento
      </p>
      <p className="mb-3 text-sm text-amber-900/80">
        Entrar rapidamente como uma persona do seed, sem chamar a API.
      </p>
      <div className="flex flex-col gap-1">
        {PERSONA_MOCKS.map(({ persona, label }) => (
          <button
            key={persona.id}
            type="button"
            onClick={() => loginAsPersona(persona)}
            className={cn(
              "flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition-colors",
              "hover:bg-amber-100/80",
            )}
          >
            <div className="min-w-0">
              <p className="font-medium truncate">{label}</p>
              <p className="text-xs text-muted-foreground truncate">{persona.email}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
