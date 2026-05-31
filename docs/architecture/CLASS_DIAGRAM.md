# Diagrama de Clases (Simplificado)

**Proyecto:** ServSoftBagm  
**Fecha:** 2026-05-30  
**Nivel:** Conceptual / Alto Nivel

---

## Diagrama

```mermaid
classDiagram
    class User {
        +id: number
        +username: string
        +passwordHash: string
        +twofaSecret: string
        +role: string
        +createdAt: Date
        +leads(): Lead[]
        +invoices(): Invoice[]
    }

    class Lead {
        +id: number
        +ticketNumber: string
        +name: string
        +phone: string
        +address: string
        +service: string
        +requirement: string
        +equipmentDescription: string
        +images: string[]
        +status: string
        +clientNotes: string
        +createdAt: Date
        +otps(): LeadOTP[]
    }

    class LeadOTP {
        +id: number
        +leadId: number
        +code: string
        +expiresAt: Date
        +used: boolean
    }

    class Invoice {
        +id: number
        +customerName: string
        +date: Date
        +lineItems: object[]
        +total: number
        +paymentMethod: string
        +notes: string
        +status: string
        +createdBy: number
    }

    class Transaction {
        +id: number
        +type: string
        +category: string
        +amount: number
        +date: Date
        +reference: string
    }

    User "1" --> "*" Lead : registra
    User "1" --> "*" Invoice : crea
    Lead "1" --> "*" LeadOTP : tiene
    Invoice "1" --> "*" Transaction : genera
```

---

## Explicación de las Entidades Principales

### User
- Representa tanto administradores como (en el futuro) clientes.
- Actualmente solo existe el rol `admin` / `superadmin`.

### Lead
- Es la entidad central del sistema en esta fase.
- Representa una solicitud de servicio (puede provenir del chatbot o registro manual).
- Contiene toda la información necesaria para dar seguimiento (incluyendo fotos del equipo).

### LeadOTP
- Códigos de un solo uso para que el cliente acceda al Portal sin contraseña.

### Invoice & Transaction
- Módulo actual de facturación y contabilidad básica.

---

## Notas

- Este diagrama es **simplificado** y representa el estado actual del sistema.
- En fases futuras se recomienda separar `Client` de `Lead` y crear una entidad `Equipment`.
- El modelo actual prioriza velocidad de desarrollo sobre normalización perfecta.

**Recomendación:** Mantener este diagrama actualizado cada vez que se agregue una entidad importante al sistema.
