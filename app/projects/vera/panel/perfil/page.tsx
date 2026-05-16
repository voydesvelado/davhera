"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { DoctorPageHeader } from "../../_components/product/doctor/DoctorPageHeader";
import { Input } from "../../_components/ui/Input";
import { Textarea } from "../../_components/ui/Textarea";
import { Label } from "../../_components/ui/Label";
import { Button } from "../../_components/ui/Button";
import { PhoneInput } from "../../_components/ui/PhoneInput";
import { useToast } from "../../_components/ui/Toast";
import { useEphemeralSave } from "../../_components/ui/EphemeralSaveToast";
import { DoctorAvatar } from "../../_components/product/DoctorAvatar";
import { PhotoUploadStub } from "../../_components/product/doctor/PhotoUploadStub";
import {
  LocationEditor,
  locationToEditable,
  type EditableLocation,
} from "../../_components/product/doctor/LocationEditor";
import { SEED_DOCTOR } from "../../_lib/seed";

const MAX_BIO = 500;

function digitsFromE164(e164: string): string {
  return e164.replace(/^\+52/, "").replace(/\D/g, "").slice(0, 10);
}

export default function PerfilPage() {
  const [name, setName] = useState(SEED_DOCTOR.name);
  const [specialty, setSpecialty] = useState(SEED_DOCTOR.specialty);
  const [cedula, setCedula] = useState(SEED_DOCTOR.cedula);
  const [bio, setBio] = useState(SEED_DOCTOR.bio);
  const [whatsappDigits, setWhatsappDigits] = useState(digitsFromE164(SEED_DOCTOR.whatsapp));
  const [instagram, setInstagram] = useState((SEED_DOCTOR.instagram ?? "").replace(/^@/, ""));
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState<EditableLocation>(() => locationToEditable(SEED_DOCTOR.location));
  const [photoOpen, setPhotoOpen] = useState(false);

  const toast = useToast();
  const ephemeral = useEphemeralSave();

  function notifyChange<T>(setter: (v: T) => void, v: T) {
    setter(v);
    ephemeral.notify();
  }

  return (
    <>
      <DoctorPageHeader
        title="Perfil"
        subtitle="Lo que tus pacientes verán en tu página"
        action={
          <Link
            href="/projects/vera/dra-sofia-ramirez"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-1)",
              padding: "var(--space-2) var(--space-3)",
              fontSize: "var(--text-sm)",
              color: "var(--accent)",
              textDecoration: "none",
              borderRadius: "var(--radius-sm)",
            }}
            className="vera-public-link"
          >
            Ver mi página pública
            <ExternalLink size={14} strokeWidth={1.75} />
            <style>{`.vera-public-link:hover { background: var(--bg-sunken); }`}</style>
          </Link>
        }
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", paddingBottom: "var(--space-12)" }}>
        <Card title="Foto">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
            <DoctorAvatar doctor={SEED_DOCTOR} size={96} />
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <Button size="sm" variant="secondary" onClick={() => setPhotoOpen(true)}>
                Cambiar foto
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  toast.show({
                    tone: "default",
                    message: "(En el demo no se modifica la imagen)",
                  })
                }
                style={{ color: "var(--ink-soft)" }}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </Card>

        <Card title="Información básica">
          <Field label="Nombre completo">
            <Input value={name} onChange={(e) => notifyChange(setName, e.target.value)} />
          </Field>
          <Field label="Especialidad">
            <Input value={specialty} onChange={(e) => notifyChange(setSpecialty, e.target.value)} />
          </Field>
          <Field label="Cédula profesional">
            <Input value={cedula} onChange={(e) => notifyChange(setCedula, e.target.value)} />
          </Field>
        </Card>

        <Card title="Biografía">
          <Textarea
            value={bio}
            onChange={(e) => notifyChange(setBio, e.target.value.slice(0, MAX_BIO))}
            rows={6}
            style={{ minHeight: 160 }}
          />
          <p
            style={{
              margin: 0,
              fontSize: "var(--text-xs)",
              color: bio.length >= MAX_BIO * 0.95 ? "var(--warning)" : "var(--muted)",
              textAlign: "right",
              fontFeatureSettings: '"tnum" 1',
            }}
          >
            {bio.length} / {MAX_BIO} caracteres
          </p>
        </Card>

        <Card title="Contacto y redes">
          <Field label="WhatsApp">
            <PhoneInput value={whatsappDigits} onChange={(d) => notifyChange(setWhatsappDigits, d)} />
          </Field>
          <Field label="Instagram">
            <div
              style={{
                display: "flex",
                alignItems: "stretch",
                height: "var(--field-height-base)",
                background: "var(--bg-raised)",
                border: "1px solid var(--rule)",
                borderRadius: "var(--radius-sm)",
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0 var(--space-3)",
                  background: "var(--bg-sunken)",
                  color: "var(--muted)",
                  fontSize: "var(--text-base)",
                  fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
                  borderRight: "1px solid var(--rule)",
                }}
              >
                @
              </span>
              <input
                value={instagram}
                onChange={(e) => notifyChange(setInstagram, e.target.value.replace(/^@/, ""))}
                style={{
                  flex: 1,
                  height: "100%",
                  padding: "0 var(--space-3)",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontFamily: "var(--font-geist), system-ui, sans-serif",
                  fontSize: "var(--text-base)",
                  color: "var(--ink)",
                }}
              />
            </div>
          </Field>
          <Field label="Email opcional">
            <Input
              type="email"
              value={email}
              placeholder="contacto@ejemplo.com"
              onChange={(e) => notifyChange(setEmail, e.target.value)}
            />
          </Field>
        </Card>

        <Card title="Ubicación">
          <LocationEditor
            value={location}
            onChange={(next) => {
              setLocation(next);
              ephemeral.notify();
            }}
          />
        </Card>

        <Card title="Zona horaria">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--space-3)",
              padding: "var(--space-3) var(--space-4)",
              background: "var(--bg-sunken)",
              border: "1px solid var(--rule-faint)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <span style={{ fontSize: "var(--text-md)", color: "var(--ink)" }}>
              America/Mexico_City <span style={{ color: "var(--muted)" }}>(GMT-6)</span>
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => toast.show({ tone: "default", message: "Próximamente" })}
            >
              Cambiar
            </Button>
          </div>
        </Card>
      </div>

      <PhotoUploadStub open={photoOpen} onOpenChange={setPhotoOpen} />
    </>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        background: "var(--bg-raised)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-5) var(--space-5) var(--space-5)",
      }}
    >
      <h2
        style={{
          margin: "0 0 var(--space-4)",
          fontSize: "var(--text-xs)",
          fontWeight: 500,
          letterSpacing: "var(--tracking-widest)",
          textTransform: "uppercase",
          color: "var(--muted)",
        }}
      >
        {title}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        {children}
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1_5)" }}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
