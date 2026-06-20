import { useFinance } from '../../context/useFinance'
import { BANK_META } from '../../data/finance'

export function Connections() {
  const { bankStatus, connecting, connectBank } = useFinance()

  return (
    <div className="max-w-[680px]">
      {/* security note */}
      <div className="mb-5 flex items-start gap-[13px] rounded-[18px] border border-[#d7e6da] bg-[#eef3ee] p-[18px]">
        <span className="text-xl">🔒</span>
        <div className="text-[13.5px] leading-[1.55] text-[#3f5e4a]">
          Conexões autorizadas via Open Finance regulado pelo BACEN. Você controla o que
          compartilha e pode revogar a qualquer momento.
        </div>
      </div>

      {/* banks */}
      <div className="flex flex-col gap-3">
        {BANK_META.map((b) => {
          const status = bankStatus[b.id]
          const isConnecting = connecting === b.id
          const on = status === 'on'

          let statusText = 'Não conectado'
          let statusColor = '#a8a499'
          if (isConnecting) {
            statusText = 'Conectando…'
            statusColor = '#8a8678'
          } else if (on) {
            statusText = 'Conectado · sincronizando'
            statusColor = '#3f7a55'
          }

          return (
            <div
              key={b.id}
              className="card flex items-center gap-[15px] rounded-[18px] px-5 py-[17px]"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-[13px] text-[17px] font-extrabold text-white"
                style={{ background: b.color }}
              >
                {b.letter}
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-bold text-ink">{b.name}</div>
                <div className="text-[13px]" style={{ color: statusColor }}>
                  {statusText}
                </div>
              </div>

              {isConnecting ? (
                <div
                  className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-[#d6d3c8]"
                  style={{ borderTopColor: '#3f7a55' }}
                />
              ) : on ? (
                <span className="text-[13px] font-bold text-forest-600">Ativo ✓</span>
              ) : (
                <button
                  type="button"
                  onClick={() => connectBank(b.id)}
                  className="rounded-xl bg-forest-800 px-4 py-2 text-[13px] font-bold text-white transition-opacity hover:opacity-90"
                >
                  Conectar
                </button>
              )}
            </div>
          )
        })}
      </div>

      <button
        type="button"
        className="mt-4 w-full rounded-[18px] border-[1.5px] border-dashed border-[#cfcdc1] p-[17px] text-center text-sm text-muted transition-colors hover:border-forest-500 hover:text-ink-3"
      >
        + Conectar nova instituição
      </button>
    </div>
  )
}
