import { useEffect, useState } from 'react'

type BonusRow = {
    bono: string
    rollover: string
    rango: string
    bonoMaximo: string
    gananciaMaxima: string
}

type CountryBonus = {
    flag: string
    country: string
    currency: string
    mondayWednesday: BonusRow[]
    thursdayFriday: BonusRow[]
    saturday: BonusRow[]
}

// =====================================================
// DATOS DE BONOS POR PAÍS
// Los valores de bono máximo y ganancia máxima son
// provisionales en países distintos de Colombia.
// Puedes modificarlos directamente aquí.
// =====================================================

const countryBonuses: CountryBonus[] = [
    {
        flag: '🇨🇴',
        country: 'Colombia',
        currency: 'COP',
        mondayWednesday: [
            {
                bono: '50%',
                rollover: 'X5',
                rango: '$20.000 a $60.000 COP',
                bonoMaximo: '$80.000 COP',
                gananciaMaxima: '$150.000 COP',
            },
            {
                bono: '60%',
                rollover: 'X4',
                rango: '$60.001 a $99.999 COP',
                bonoMaximo: '$80.000 COP',
                gananciaMaxima: '$250.000 COP',
            },
            {
                bono: '80%',
                rollover: 'X3',
                rango: 'Desde $100.000 COP',
                bonoMaximo: '$80.000 COP',
                gananciaMaxima: '$300.000 COP',
            },
        ],
        thursdayFriday: [
            {
                bono: '30%',
                rollover: 'X6',
                rango: '$20.000 a $60.000 COP',
                bonoMaximo: '$90.000 COP',
                gananciaMaxima: '$150.000 COP',
            },
            {
                bono: '30%',
                rollover: 'X6',
                rango: '$60.001 a $99.999 COP',
                bonoMaximo: '$90.000 COP',
                gananciaMaxima: '$250.000 COP',
            },
            {
                bono: '30%',
                rollover: 'X6',
                rango: 'Desde $100.000 COP',
                bonoMaximo: '$90.000 COP',
                gananciaMaxima: '$300.000 COP',
            },
        ],
        saturday: [
            {
                bono: '20%',
                rollover: 'X5',
                rango: '$20.000 a $60.000 COP',
                bonoMaximo: '$60.000 COP',
                gananciaMaxima: '$100.000 COP',
            },
            {
                bono: '20%',
                rollover: 'X5',
                rango: '$60.001 a $99.999 COP',
                bonoMaximo: '$60.000 COP',
                gananciaMaxima: '$180.000 COP',
            },
            {
                bono: '20%',
                rollover: 'X5',
                rango: 'Desde $100.000 COP',
                bonoMaximo: '$60.000 COP',
                gananciaMaxima: '$230.000 COP',
            },
        ],
    },

    {
        flag: '🇵🇪',
        country: 'Perú',
        currency: 'PEN',
        mondayWednesday: [
            {
                bono: '50%',
                rollover: 'X5',
                rango: 'S/ 20 a S/ 60',
                bonoMaximo: 'S/ 80',
                gananciaMaxima: 'S/ 150',
            },
            {
                bono: '60%',
                rollover: 'X4',
                rango: 'S/ 61 a S/ 99',
                bonoMaximo: 'S/ 80',
                gananciaMaxima: 'S/ 250',
            },
            {
                bono: '80%',
                rollover: 'X3',
                rango: 'Desde S/ 100',
                bonoMaximo: 'S/ 80',
                gananciaMaxima: 'S/ 300',
            },
        ],
        thursdayFriday: [
            {
                bono: '30%',
                rollover: 'X6',
                rango: 'S/ 20 a S/ 60',
                bonoMaximo: 'S/ 90',
                gananciaMaxima: 'S/ 150',
            },
            {
                bono: '30%',
                rollover: 'X6',
                rango: 'S/ 61 a S/ 99',
                bonoMaximo: 'S/ 90',
                gananciaMaxima: 'S/ 250',
            },
            {
                bono: '30%',
                rollover: 'X6',
                rango: 'Desde S/ 100',
                bonoMaximo: 'S/ 90',
                gananciaMaxima: 'S/ 300',
            },
        ],
        saturday: [
            {
                bono: '20%',
                rollover: 'X5',
                rango: 'S/ 20 a S/ 60',
                bonoMaximo: 'S/ 60',
                gananciaMaxima: 'S/ 100',
            },
            {
                bono: '20%',
                rollover: 'X5',
                rango: 'S/ 61 a S/ 99',
                bonoMaximo: 'S/ 60',
                gananciaMaxima: 'S/ 180',
            },
            {
                bono: '20%',
                rollover: 'X5',
                rango: 'Desde S/ 100',
                bonoMaximo: 'S/ 60',
                gananciaMaxima: 'S/ 230',
            },
        ],
    },

    {
        flag: '🇺🇸',
        country: 'Dólar',
        currency: 'USD',
        mondayWednesday: [
            {
                bono: '50%',
                rollover: 'X5',
                rango: 'US$5 a US$20',
                bonoMaximo: 'US$40',
                gananciaMaxima: 'US$80',
            },
            {
                bono: '60%',
                rollover: 'X4',
                rango: 'US$21 a US$60',
                bonoMaximo: 'US$40',
                gananciaMaxima: 'US$100',
            },
            {
                bono: '80%',
                rollover: 'X3',
                rango: 'Desde US$61',
                bonoMaximo: 'US$40',
                gananciaMaxima: 'US$120',
            },
        ],
        thursdayFriday: [
            {
                bono: '30%',
                rollover: 'X6',
                rango: 'US$5 a US$20',
                bonoMaximo: 'US$50',
                gananciaMaxima: 'US$80',
            },
            {
                bono: '30%',
                rollover: 'X6',
                rango: 'US$21 a US$60',
                bonoMaximo: 'US$50',
                gananciaMaxima: 'US$100',
            },
            {
                bono: '30%',
                rollover: 'X6',
                rango: 'Desde US$61',
                bonoMaximo: 'US$50',
                gananciaMaxima: 'US$120',
            },
        ],
        saturday: [
            {
                bono: '20%',
                rollover: 'X5',
                rango: 'US$5 a US$20',
                bonoMaximo: 'US$30',
                gananciaMaxima: 'US$50',
            },
            {
                bono: '20%',
                rollover: 'X5',
                rango: 'US$21 a US$60',
                bonoMaximo: 'US$30',
                gananciaMaxima: 'US$80',
            },
            {
                bono: '20%',
                rollover: 'X5',
                rango: 'Desde US$61',
                bonoMaximo: 'US$30',
                gananciaMaxima: 'US$100',
            },
        ],
    },

    {
        flag: '🇨🇱',
        country: 'Chile',
        currency: 'CLP',
        mondayWednesday: [
            {
                bono: '50%',
                rollover: 'X5',
                rango: '$5.000 a $20.000 CLP',
                bonoMaximo: '$40.000 CLP',
                gananciaMaxima: '$80.000 CLP',
            },
            {
                bono: '60%',
                rollover: 'X4',
                rango: '$21.000 a $60.000 CLP',
                bonoMaximo: '$40.000 CLP',
                gananciaMaxima: '$100.000 CLP',
            },
            {
                bono: '80%',
                rollover: 'X3',
                rango: 'Desde $61.000 CLP',
                bonoMaximo: '$40.000 CLP',
                gananciaMaxima: '$120.000 CLP',
            },
        ],
        thursdayFriday: [
            {
                bono: '30%',
                rollover: 'X6',
                rango: '$5.000 a $20.000 CLP',
                bonoMaximo: '$50.000 CLP',
                gananciaMaxima: '$80.000 CLP',
            },
            {
                bono: '30%',
                rollover: 'X6',
                rango: '$21.000 a $60.000 CLP',
                bonoMaximo: '$50.000 CLP',
                gananciaMaxima: '$100.000 CLP',
            },
            {
                bono: '30%',
                rollover: 'X6',
                rango: 'Desde $61.000 CLP',
                bonoMaximo: '$50.000 CLP',
                gananciaMaxima: '$120.000 CLP',
            },
        ],
        saturday: [
            {
                bono: '20%',
                rollover: 'X5',
                rango: '$5.000 a $20.000 CLP',
                bonoMaximo: '$30.000 CLP',
                gananciaMaxima: '$50.000 CLP',
            },
            {
                bono: '20%',
                rollover: 'X5',
                rango: '$21.000 a $60.000 CLP',
                bonoMaximo: '$30.000 CLP',
                gananciaMaxima: '$80.000 CLP',
            },
            {
                bono: '20%',
                rollover: 'X5',
                rango: 'Desde $61.000 CLP',
                bonoMaximo: '$30.000 CLP',
                gananciaMaxima: '$100.000 CLP',
            },
        ],
    },

    {
        flag: '🇻🇪',
        country: 'Venezuela',
        currency: 'VES',
        mondayWednesday: [
            {
                bono: '50%',
                rollover: 'X5',
                rango: 'Bs. 1.000 a Bs. 3.000',
                bonoMaximo: 'Bs. 4.000',
                gananciaMaxima: 'Bs. 8.000',
            },
            {
                bono: '60%',
                rollover: 'X4',
                rango: 'Bs. 3.100 a Bs. 5.000',
                bonoMaximo: 'Bs. 4.000',
                gananciaMaxima: 'Bs. 10.000',
            },
            {
                bono: '80%',
                rollover: 'X3',
                rango: 'Desde Bs. 5.100',
                bonoMaximo: 'Bs. 4.000',
                gananciaMaxima: 'Bs. 12.000',
            },
        ],
        thursdayFriday: [
            {
                bono: '30%',
                rollover: 'X6',
                rango: 'Bs. 1.000 a Bs. 3.000',
                bonoMaximo: 'Bs. 5.000',
                gananciaMaxima: 'Bs. 8.000',
            },
            {
                bono: '30%',
                rollover: 'X6',
                rango: 'Bs. 3.100 a Bs. 5.000',
                bonoMaximo: 'Bs. 5.000',
                gananciaMaxima: 'Bs. 10.000',
            },
            {
                bono: '30%',
                rollover: 'X6',
                rango: 'Desde Bs. 5.100',
                bonoMaximo: 'Bs. 5.000',
                gananciaMaxima: 'Bs. 12.000',
            },
        ],
        saturday: [
            {
                bono: '20%',
                rollover: 'X5',
                rango: 'Bs. 1.000 a Bs. 3.000',
                bonoMaximo: 'Bs. 2.000',
                gananciaMaxima: 'Bs. 4.000',
            },
            {
                bono: '20%',
                rollover: 'X5',
                rango: 'Bs. 3.100 a Bs. 5.000',
                bonoMaximo: 'Bs. 2.000',
                gananciaMaxima: 'Bs. 5.000',
            },
            {
                bono: '20%',
                rollover: 'X5',
                rango: 'Desde Bs. 5.100',
                bonoMaximo: 'Bs. 2.000',
                gananciaMaxima: 'Bs. 6.000',
            },
        ],
    },

    {
        flag: '🇧🇷',
        country: 'Brasil',
        currency: 'BRL',
        mondayWednesday: [
            {
                bono: '50%',
                rollover: 'X5',
                rango: 'R$20 a R$70',
                bonoMaximo: 'R$88',
                gananciaMaxima: 'R$150',
            },
            {
                bono: '60%',
                rollover: 'X4',
                rango: 'R$71 a R$110',
                bonoMaximo: 'R$88',
                gananciaMaxima: 'R$250',
            },
            {
                bono: '80%',
                rollover: 'X3',
                rango: 'Desde R$111',
                bonoMaximo: 'R$88',
                gananciaMaxima: 'R$300',
            },
        ],
        thursdayFriday: [
            {
                bono: '30%',
                rollover: 'X6',
                rango: 'R$20 a R$70',
                bonoMaximo: 'R$95',
                gananciaMaxima: 'R$150',
            },
            {
                bono: '30%',
                rollover: 'X6',
                rango: 'R$71 a R$110',
                bonoMaximo: 'R$95',
                gananciaMaxima: 'R$250',
            },
            {
                bono: '30%',
                rollover: 'X6',
                rango: 'Desde R$111',
                bonoMaximo: 'R$95',
                gananciaMaxima: 'R$300',
            },
        ],
        saturday: [
            {
                bono: '20%',
                rollover: 'X5',
                rango: 'R$20 a R$70',
                bonoMaximo: 'R$60',
                gananciaMaxima: 'R$100',
            },
            {
                bono: '20%',
                rollover: 'X5',
                rango: 'R$71 a R$110',
                bonoMaximo: 'R$60',
                gananciaMaxima: 'R$150',
            },
            {
                bono: '20%',
                rollover: 'X5',
                rango: 'Desde R$111',
                bonoMaximo: 'R$60',
                gananciaMaxima: 'R$200',
            },
        ],
    },

    {
        flag: '🇲🇽',
        country: 'México',
        currency: 'MXN',
        mondayWednesday: [
            {
                bono: '50%',
                rollover: 'X5',
                rango: 'MX$85 a MX$160',
                bonoMaximo: 'MX$261',
                gananciaMaxima: 'MX$400',
            },
            {
                bono: '60%',
                rollover: 'X4',
                rango: 'MX$161 a MX$260',
                bonoMaximo: 'MX$261',
                gananciaMaxima: 'MX$550',
            },
            {
                bono: '80%',
                rollover: 'X3',
                rango: 'Desde MX$261',
                bonoMaximo: 'MX$261',
                gananciaMaxima: 'MX$600',
            },
        ],
        thursdayFriday: [
            {
                bono: '30%',
                rollover: 'X6',
                rango: 'MX$85 a MX$160',
                bonoMaximo: 'MX$261',
                gananciaMaxima: 'MX$400',
            },
            {
                bono: '30%',
                rollover: 'X6',
                rango: 'MX$161 a MX$260',
                bonoMaximo: 'MX$261',
                gananciaMaxima: 'MX$550',
            },
            {
                bono: '30%',
                rollover: 'X6',
                rango: 'Desde MX$261',
                bonoMaximo: 'MX$261',
                gananciaMaxima: 'MX$600',
            },
        ],
        saturday: [
            {
                bono: '20%',
                rollover: 'X5',
                rango: 'MX$85 a MX$160',
                bonoMaximo: 'MX$100',
                gananciaMaxima: 'MX$200',
            },
            {
                bono: '20%',
                rollover: 'X5',
                rango: 'MX$161 a MX$260',
                bonoMaximo: 'MX$100',
                gananciaMaxima: 'MX$250',
            },
            {
                bono: '20%',
                rollover: 'X5',
                rango: 'Desde MX$261',
                bonoMaximo: 'MX$100',
                gananciaMaxima: 'MX$300',
            },
        ],
    },
]

// =====================================================
// COMPONENTES VISUALES
// =====================================================

function HorseSymbol() {
    return (
        <img
            src="/LandingPageBabieca/png-horse-final.png"
            alt="Babieca"
            className="w-12 h-12 object-contain"
        />
    )
}

function BrandMark() {
    return (
        <div className="flex items-center gap-3">
            <HorseSymbol />

            <div className="leading-none">
                <div className="text-[8px] tracking-[0.28em] text-[#F5F0E8]/50 mt-1">
                    HÍPICAS
                </div>
                <div className="font-barlow font-black tracking-[0.18em] text-[#C9A227] text-lg">
                    BABIECA
                </div>


            </div>
        </div>
    )
}

function SectionDivider() {
    return (
        <div className="flex items-center gap-4 my-10">
            <div className="h-px flex-1 bg-[#C9A227]/10" />
            <div className="w-1 h-1 rotate-45 bg-[#C9A227]" />
            <div className="h-px flex-1 bg-[#C9A227]/10" />
        </div>
    )
}

// =====================================================
// TABLA DE BONOS
// =====================================================

function BonusTable({
    title,
    rows,
}: {
    title: string
    rows: BonusRow[]
}) {
    return (
        <div className="mb-8">
            <h3 className="font-barlow font-bold text-xl text-[#F5F0E8] mb-4">
                {title}
            </h3>

            <div className="overflow-x-auto rounded-xl border border-[#C9A227]/15">
                <table className="w-full min-w-[760px] text-left border-collapse">
                    <thead>
                        <tr className="bg-[#C9A227]/10">
                            <th className="px-4 py-4 text-[10px] uppercase tracking-widest text-[#C9A227]">
                                Tipo
                            </th>

                            <th className="px-4 py-4 text-[10px] uppercase tracking-widest text-[#C9A227]">
                                Porcentaje
                            </th>

                            <th className="px-4 py-4 text-[10px] uppercase tracking-widest text-[#C9A227]">
                                Rollover
                            </th>

                            <th className="px-4 py-4 text-[10px] uppercase tracking-widest text-[#C9A227]">
                                Rango de recarga
                            </th>

                            <th className="px-4 py-4 text-[10px] uppercase tracking-widest text-[#C9A227]">
                                Bono máximo
                            </th>

                            <th className="px-4 py-4 text-[10px] uppercase tracking-widest text-[#C9A227]">
                                Ganancia máxima
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {rows.map((row, index) => (
                            <tr
                                key={index}
                                className="border-t border-[#C9A227]/10 hover:bg-[#C9A227]/[0.03] transition-colors"
                            >
                                <td className="px-4 py-4 text-sm text-[#F5F0E8]/80">
                                    Hipismo
                                </td>

                                <td className="px-4 py-4 text-sm font-bold text-[#C9A227]">
                                    {row.bono}
                                </td>

                                <td className="px-4 py-4 text-sm font-bold text-[#F5F0E8]">
                                    {row.rollover}
                                </td>

                                <td className="px-4 py-4 text-sm text-[#F5F0E8]/70">
                                    {row.rango}
                                </td>

                                <td className="px-4 py-4 text-sm text-[#F5F0E8]/70">
                                    {row.bonoMaximo}
                                </td>

                                <td className="px-4 py-4 text-sm text-[#F5F0E8]/70">
                                    {row.gananciaMaxima}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

export default function TermsAndConditions({
    onBack,
}: {
    onBack: () => void
}) {
    const [countryIndex, setCountryIndex] = useState(0)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const selectedCountry = countryBonuses[countryIndex]

    const previousCountry = () => {
        setCountryIndex((current) =>
            current === 0 ? countryBonuses.length - 1 : current - 1,
        )
    }

    const nextCountry = () => {
        setCountryIndex((current) =>
            current === countryBonuses.length - 1 ? 0 : current + 1,
        )
    }

    return (
        <div className="min-h-screen bg-[#090909] text-[#F5F0E8]">
            {/* =================================================
          HEADER
      ================================================= */}

            <header className="sticky top-0 z-50 bg-[#090909]/95 backdrop-blur-md border-b border-[#C9A227]/10">
                <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
                    <BrandMark />

                    <button
                        onClick={onBack}
                        className="group flex items-center gap-2 px-4 py-2 rounded-full border border-[#C9A227]/25 text-[10px] font-bold tracking-[0.16em] text-[#F5F0E8]/70 hover:text-[#C9A227] hover:border-[#C9A227]/60 transition-all"
                    >
                        <span className="text-base leading-none group-hover:-translate-x-1 transition-transform">
                            ←
                        </span>

                        VOLVER
                    </button>
                </div>
            </header>

            {/* =================================================
          CONTENIDO
      ================================================= */}

            <main className="max-w-5xl mx-auto px-5 py-12 md:py-20">
                {/* TÍTULO */}

                <div className="text-center max-w-3xl mx-auto">
                    <p className="text-[10px] tracking-[0.35em] text-[#C9A227] font-bold uppercase mb-4">
                        Información legal
                    </p>

                    <h1 className="font-barlow font-black uppercase text-4xl md:text-6xl tracking-tight leading-none">
                        Términos y
                        <span className="block text-[#C9A227]">
                            Condiciones
                        </span>
                    </h1>

                    <p className="mt-6 text-sm md:text-base text-[#F5F0E8]/55 leading-relaxed">
                        HÍPICAS BABIECA · Bonos de Hipismo y Programa de Cashback
                    </p>
                </div>

                <SectionDivider />

                {/* =================================================
            1. CONDICIONES GENERALES
        ================================================= */}

                <section>
                    <SectionTitle number="01" title="Condiciones generales" />

                    <div className="space-y-4">
                        <Bullet>
                            Las promociones de HÍPICAS BABIECA están sujetas a los presentes
                            Términos y Condiciones y a las condiciones particulares
                            establecidas para cada promoción y día de la semana.
                        </Bullet>

                        <Bullet>
                            La participación en una promoción implica la aceptación de sus
                            condiciones. Las promociones aplican únicamente a usuarios
                            mayores de 18 años y registrados en HÍPICAS BABIECA.
                        </Bullet>

                        <Bullet>
                            Los bonos son personales e intransferibles. HÍPICAS BABIECA
                            podrá validar la identidad del usuario y revisar datos asociados
                            a la cuenta, hogar, dirección, correo electrónico, número
                            telefónico, método de pago y/o dirección IP con el fin de
                            prevenir duplicidad, fraude o uso indebido de promociones.
                        </Bullet>

                        <Bullet>
                            Salvo que se indique lo contrario, los bonos y las ganancias
                            promocionales no estarán disponibles para retiro hasta que se
                            cumplan los requisitos de liberación aplicables.
                        </Bullet>

                        <Bullet>
                            Los bonos son asignados manualmente por el equipo de Atención al
                            Cliente (ATC), cuando corresponda. El usuario deberá cumplir la
                            recarga mínima y demás requisitos establecidos para activar cada
                            promoción.
                        </Bullet>

                        <Bullet>
                            Las ganancias máximas de bonos y giros están sujetas a los
                            límites indicados en cada promoción. Cualquier excedente sobre la
                            ganancia máxima aplicable podrá ser descontado del saldo
                            promocional.
                        </Bullet>

                        <Bullet>
                            Vigencia general de las promociones: hasta el 31 de diciembre de
                            2026 o hasta agotar existencia/disponibilidad, lo que ocurra
                            primero.
                        </Bullet>
                    </div>
                </section>

                <SectionDivider />

                {/* =================================================
            2. BONOS
        ================================================= */}

                <section>
                    <SectionTitle number="02" title="Bonos de Hipismo por día" />

                    <p className="text-sm text-[#F5F0E8]/60 leading-relaxed mb-8">
                        El bono se aplica sobre la primera recarga elegible del día, de
                        acuerdo con el rango de recarga, porcentaje, rollover, bono máximo
                        y ganancia máxima indicados a continuación.
                    </p>

                    {/* SELECTOR DE PAÍS */}

                    <div className="rounded-2xl border border-[#C9A227]/15 bg-[#0F0F0F] p-5 md:p-6 mb-10">
                        <div className="text-center mb-5">
                            <p className="text-[9px] tracking-[0.3em] uppercase text-[#C9A227] font-bold">
                                Selecciona tu moneda
                            </p>

                            <h3 className="font-barlow font-bold text-2xl mt-2">
                                Bonos para {selectedCountry.country}
                            </h3>
                        </div>

                        <div className="flex items-center justify-center gap-3">
                            <button
                                onClick={previousCountry}
                                aria-label="País anterior"
                                className="w-10 h-10 rounded-full border border-[#C9A227]/25 text-[#C9A227] hover:bg-[#C9A227]/10 transition-colors text-xl"
                            >
                                ‹
                            </button>

                            <div className="min-w-[190px] md:min-w-[250px] text-center px-5 py-4 rounded-xl bg-[#C9A227]/[0.06] border border-[#C9A227]/20">
                                <div className="text-3xl mb-2">
                                    {selectedCountry.flag}
                                </div>

                                <div className="font-barlow font-bold text-lg">
                                    {selectedCountry.country}
                                </div>

                                <div className="text-[9px] tracking-[0.25em] text-[#C9A227] mt-1 uppercase">
                                    {selectedCountry.currency}
                                </div>
                            </div>

                            <button
                                onClick={nextCountry}
                                aria-label="Siguiente país"
                                className="w-10 h-10 rounded-full border border-[#C9A227]/25 text-[#C9A227] hover:bg-[#C9A227]/10 transition-colors text-xl"
                            >
                                ›
                            </button>
                        </div>

                        {/* INDICADORES */}

                        <div className="flex justify-center gap-2 mt-5">
                            {countryBonuses.map((country, index) => (
                                <button
                                    key={country.country}
                                    onClick={() => setCountryIndex(index)}
                                    aria-label={`Seleccionar ${country.country}`}
                                    className={`h-1.5 rounded-full transition-all ${index === countryIndex
                                            ? 'w-7 bg-[#C9A227]'
                                            : 'w-1.5 bg-[#C9A227]/20 hover:bg-[#C9A227]/50'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    <BonusTable
                        title="Lunes, martes y miércoles"
                        rows={selectedCountry.mondayWednesday}
                    />

                    <p className="text-sm text-[#F5F0E8]/55 leading-relaxed border-l-2 border-[#C9A227]/30 pl-4 mb-10">
                        Para recargas de {selectedCountry.currency === 'COP'
                            ? '$100.000 COP'
                            : selectedCountry.currency === 'PEN'
                                ? 'S/ 100'
                                : selectedCountry.currency === 'USD'
                                    ? 'US$60'
                                    : selectedCountry.currency === 'CLP'
                                        ? '$60.000 CLP'
                                        : selectedCountry.currency === 'VES'
                                            ? 'Bs. 5.000'
                                            : selectedCountry.currency === 'BRL'
                                                ? 'R$110'
                                                : 'MX$260'}{' '}
                        o más, el bono será del 80% hasta alcanzar el bono máximo indicado.
                        Una recarga superior no incrementará el bono por encima de este
                        límite.
                    </p>

                    <BonusTable
                        title="Jueves y viernes"
                        rows={selectedCountry.thursdayFriday}
                    />

                    <p className="text-sm text-[#F5F0E8]/55 leading-relaxed border-l-2 border-[#C9A227]/30 pl-4 mb-10">
                        En ningún caso el bono otorgado podrá superar el bono máximo
                        indicado para este período, independientemente del valor de la
                        recarga.
                    </p>

                    <BonusTable
                        title="Sábado"
                        rows={selectedCountry.saturday}
                    />

                    <p className="text-sm text-[#F5F0E8]/55 leading-relaxed border-l-2 border-[#C9A227]/30 pl-4">
                        En ningún caso el bono otorgado podrá superar el bono máximo
                        indicado para el sábado, independientemente del valor de la
                        recarga.
                    </p>
                </section>

                <SectionDivider />

                {/* =================================================
            3. ROLLOVER
        ================================================= */}

                <section>
                    <SectionTitle number="03" title="Rollover y liberación" />

                    <div className="space-y-4">
                        <Bullet>
                            El rollover corresponde al número de veces que deberá apostarse
                            el monto aplicable a la promoción antes de que el bono y las
                            ganancias promocionales asociadas queden habilitados para retiro.
                        </Bullet>

                        <Bullet>
                            El rollover aplicable será el indicado en la tabla de la
                            promoción recibida.
                        </Bullet>

                        <Bullet>
                            Las apuestas anuladas, canceladas, reembolsadas o declaradas
                            nulas no contabilizarán para el cumplimiento del rollover.
                        </Bullet>

                        <Bullet>
                            Si el usuario solicita un retiro mientras mantiene un bono activo
                            o antes de completar el rollover correspondiente, HÍPICAS BABIECA
                            podrá cancelar el bono y las ganancias promocionales asociadas,
                            conforme a las condiciones de la promoción.
                        </Bullet>

                        <Bullet>
                            Para esta promoción de Hipismo, las apuestas válidas para
                            completar el rollover deberán corresponder a las jugadas
                            elegibles definidas por HÍPICAS BABIECA.
                        </Bullet>
                    </div>
                </section>

                <SectionDivider />

                {/* =================================================
            4. GANANCIA MÁXIMA
        ================================================= */}

                <section>
                    <SectionTitle number="04" title="Ganancia máxima" />

                    <div className="space-y-4">
                        <Bullet>
                            La ganancia máxima es el monto máximo que podrá reconocerse al
                            usuario como resultado de la promoción, según el rango de
                            recarga y día aplicable.
                        </Bullet>

                        <Bullet>
                            Cuando las ganancias derivadas del bono superen el límite
                            indicado, el excedente promocional no será pagadero y podrá ser
                            descontado al momento de la liberación del bono o de la solicitud
                            de retiro.
                        </Bullet>

                        <Bullet>
                            Realizar una recarga superior al mínimo de un rango no modifica
                            el bono máximo ni la ganancia máxima establecidos para dicho
                            rango.
                        </Bullet>
                    </div>
                </section>

                <SectionDivider />

                {/* =================================================
            5. RESTRICCIONES
        ================================================= */}

                <section>
                    <SectionTitle
                        number="05"
                        title="Restricciones, validación y uso indebido"
                    />

                    <div className="space-y-4">
                        <Bullet>
                            HÍPICAS BABIECA podrá revisar la actividad de las cuentas antes
                            de liberar bonos o autorizar retiros relacionados con
                            promociones.
                        </Bullet>

                        <Bullet>
                            Podrán considerarse usos indebidos, entre otros: cuentas
                            múltiples, coordinación entre cuentas, uso irregular de métodos
                            de pago compartidos, cambios artificiales en patrones de apuesta,
                            estrategias de cobertura (hedge betting) o mecanismos destinados
                            a manipular el rollover o asegurar resultados.
                        </Bullet>

                        <Bullet>
                            Cuando existan indicios razonables de incumplimiento, HÍPICAS
                            BABIECA podrá suspender temporalmente la liberación del bono o
                            del retiro asociado mientras realiza las verificaciones
                            correspondientes.
                        </Bullet>

                        <Bullet>
                            Confirmado el incumplimiento, HÍPICAS BABIECA podrá cancelar el
                            bono y las ganancias promocionales obtenidas en contravención de
                            estos términos.
                        </Bullet>

                        <Bullet>
                            El usuario deberá proporcionar información verdadera, actualizada
                            y verificable. HÍPICAS BABIECA podrá solicitar validación de
                            identidad y titularidad de los medios de pago antes de procesar
                            ganancias promocionales.
                        </Bullet>
                    </div>
                </section>

                <SectionDivider />

                {/* =================================================
            6. MODIFICACIÓN
        ================================================= */}

                <section>
                    <SectionTitle number="06" title="Modificación o suspensión de promociones" />

                    <p className="text-sm md:text-base text-[#F5F0E8]/60 leading-8">
                        HÍPICAS BABIECA se reserva el derecho de modificar, suspender o
                        finalizar promociones por razones operativas, técnicas,
                        regulatorias, de seguridad o de prevención de abuso. Las
                        modificaciones serán aplicables conforme a las condiciones
                        publicadas para la promoción correspondiente.
                    </p>
                </section>

                <SectionDivider />

                {/* =================================================
            7. CASHBACK
        ================================================= */}

                <section>
                    <SectionTitle number="07" title="Cashback de Hípicas" />

                    <p className="text-sm md:text-base text-[#F5F0E8]/60 leading-8 mb-8">
                        El programa de Cashback de Hípicas reconoce un porcentaje sobre el
                        total apostado en jugadas elegibles que sean definidas como
                        perdidas, de acuerdo con el tipo de apuesta y la clase del
                        hipódromo.
                    </p>

                    <h3 className="font-barlow font-bold text-xl mb-4">
                        Tipos de Apuesta y Cashback
                    </h3>

                    <div className="overflow-x-auto rounded-xl border border-[#C9A227]/15 mb-10">
                        <table className="w-full min-w-[650px] text-left">
                            <thead>
                                <tr className="bg-[#C9A227]/10">
                                    <th className="px-4 py-4 text-[10px] uppercase tracking-widest text-[#C9A227]">
                                        Tipo de apuesta
                                    </th>

                                    <th className="px-4 py-4 text-[10px] uppercase tracking-widest text-[#C9A227]">
                                        Descripción
                                    </th>

                                    <th className="px-4 py-4 text-[10px] uppercase tracking-widest text-[#C9A227]">
                                        Cashback
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr className="border-t border-[#C9A227]/10">
                                    <td className="px-4 py-4 text-sm font-bold text-[#C9A227]">
                                        PWPS
                                    </td>

                                    <td className="px-4 py-4 text-sm text-[#F5F0E8]/65">
                                        Cashback sobre jugadas WIN, PLACE y SHOW.
                                    </td>

                                    <td className="px-4 py-4 text-sm font-bold">
                                        3%
                                    </td>
                                </tr>

                                <tr className="border-t border-[#C9A227]/10">
                                    <td className="px-4 py-4 text-sm font-bold text-[#C9A227]">
                                        PEXO
                                    </td>

                                    <td className="px-4 py-4 text-sm text-[#F5F0E8]/65">
                                        Cashback sobre jugadas exóticas: Exacta, Trifecta,
                                        Superfecta, Pick 2, Pick 3, Pick 4, etc.
                                    </td>

                                    <td className="px-4 py-4 text-sm font-bold">
                                        9%
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h3 className="font-barlow font-bold text-xl mb-4">
                        Tabla de Cashback por Clase de Hipódromo
                    </h3>

                    <div className="overflow-x-auto rounded-xl border border-[#C9A227]/15 mb-10">
                        <table className="w-full min-w-[600px] text-left">
                            <thead>
                                <tr className="bg-[#C9A227]/10">
                                    <th className="px-4 py-4 text-[10px] uppercase tracking-widest text-[#C9A227]">
                                        Clase de Hipódromo
                                    </th>

                                    <th className="px-4 py-4 text-[10px] uppercase tracking-widest text-[#C9A227]">
                                        PWPS
                                    </th>

                                    <th className="px-4 py-4 text-[10px] uppercase tracking-widest text-[#C9A227]">
                                        PEXO
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {[
                                    ['A', '3%', '9%'],
                                    ['B', '3%', '9%'],
                                    ['C', 'N/A', '9%'],
                                    ['D', '3%', 'N/A'],
                                    ['E', '3%', '9%'],
                                ].map(([clase, pwps, pexo]) => (
                                    <tr
                                        key={clase}
                                        className="border-t border-[#C9A227]/10"
                                    >
                                        <td className="px-4 py-4 text-sm font-bold text-[#C9A227]">
                                            {clase}
                                        </td>

                                        <td className="px-4 py-4 text-sm text-[#F5F0E8]/70">
                                            {pwps}
                                        </td>

                                        <td className="px-4 py-4 text-sm text-[#F5F0E8]/70">
                                            {pexo}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <h3 className="font-barlow font-bold text-xl mb-4">
                        Condiciones Generales del Cashback
                    </h3>

                    <div className="space-y-4">
                        <Bullet>
                            El cashback se calcula sobre el total apostado en cada tipo de
                            jugada elegible que sea definida como perdida.
                        </Bullet>

                        <Bullet>
                            El cashback se acredita automáticamente en el saldo del usuario.
                            El plazo máximo para la acreditación es de 24 horas después de
                            realizada la apuesta.
                        </Bullet>

                        <Bullet>
                            Las apuestas anuladas o canceladas no generan cashback.
                        </Bullet>

                        <Bullet>
                            HÍPICAS BABIECA se reserva el derecho de modificar, suspender o
                            finalizar el programa de cashback en cualquier momento.
                        </Bullet>

                        <Bullet>
                            La ganancia máxima obtenida al apostar saldo proveniente de
                            cashback no podrá superar 100 veces el valor apostado con dicho
                            saldo. Por ejemplo, si se realiza una apuesta de $1.000
                            proveniente de cashback, el premio máximo reconocido será de
                            $100.000.
                        </Bullet>
                    </div>

                    {/* EJEMPLO */}

                    <div className="mt-8 rounded-2xl border border-[#C9A227]/20 bg-[#C9A227]/[0.04] p-6">
                        <p className="text-[9px] uppercase tracking-[0.25em] text-[#C9A227] font-bold mb-3">
                            Ejemplo de cálculo
                        </p>

                        <p className="text-sm text-[#F5F0E8]/65 leading-7">
                            Si el usuario apuesta $10.000 COP en una Trifecta (PEXO) en un
                            hipódromo Clase A y la jugada es definida como perdida:
                        </p>

                        <p className="font-barlow font-bold text-xl text-[#C9A227] mt-4">
                            $10.000 × 9% = $900 COP de cashback
                        </p>
                    </div>
                </section>

                <SectionDivider />

                {/* =================================================
            8. DISPOSICIONES FINALES
        ================================================= */}

                <section>
                    <SectionTitle number="08" title="Disposiciones finales" />

                    <div className="space-y-4">
                        <Bullet>
                            Todas las promociones están sujetas a revisión y validación
                            interna.
                        </Bullet>

                        <Bullet>
                            Los bonos, giros y cashback no son transferibles entre usuarios.
                        </Bullet>

                        <Bullet>
                            Las apuestas anuladas, canceladas, reembolsadas o declaradas
                            nulas no generarán beneficios promocionales cuando así
                            corresponda.
                        </Bullet>

                        <Bullet>
                            En caso de controversia relacionada con una promoción, HÍPICAS
                            BABIECA revisará la actividad de la cuenta y las evidencias
                            disponibles conforme a estos Términos y Condiciones y a la
                            normativa aplicable.
                        </Bullet>
                    </div>
                </section>

                {/* =================================================
            AVISO FINAL
        ================================================= */}

                <div className="mt-14 rounded-2xl border border-[#C9A227]/15 bg-[#0F0F0F] p-6 md:p-8 text-center">
                    <div className="text-[#C9A227] text-2xl mb-3">
                        ♞
                    </div>

                    <p className="text-[10px] tracking-[0.25em] uppercase text-[#F5F0E8]/40">
                        HÍPICAS BABIECA
                    </p>

                    <p className="mt-3 text-sm text-[#F5F0E8]/50">
                        Juego responsable · +18
                    </p>
                </div>

                {/* VOLVER */}

                <div className="flex justify-center mt-10">
                    <button
                        onClick={onBack}
                        className="px-7 py-3 rounded-full bg-[#C9A227] text-[#090909] font-barlow font-bold text-sm tracking-[0.12em] hover:bg-[#DDB52E] transition-colors"
                    >
                        ← VOLVER A HÍPICAS BABIECA
                    </button>
                </div>
            </main>

            {/* =================================================
          FOOTER
      ================================================= */}

            <footer className="py-10 px-5 border-t border-[#C9A227]/10 mt-10">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
                    <BrandMark />

                    <p className="text-[10px] text-[#F5F0E8]/25 tracking-wider text-center md:text-right">
                        © 2024 Hípicas Babieca · Todos los derechos reservados
                        <br />
                        Juego responsable · +18
                    </p>
                </div>
            </footer>
        </div>
    )
}

// =====================================================
// COMPONENTES AUXILIARES
// =====================================================

function SectionTitle({
    number,
    title,
}: {
    number: string
    title: string
}) {
    return (
        <div className="flex items-start gap-4 mb-6">
            <span className="font-barlow font-black text-sm text-[#C9A227] pt-1">
                {number}
            </span>

            <h2 className="font-barlow font-black uppercase text-2xl md:text-3xl tracking-tight">
                {title}
            </h2>
        </div>
    )
}

function Bullet({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex gap-3 text-sm md:text-base text-[#F5F0E8]/60 leading-7">
            <span className="text-[#C9A227] mt-1 shrink-0">•</span>
            <p>{children}</p>
        </div>
    )
}