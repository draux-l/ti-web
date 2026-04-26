# Resend - Configuración de Email de Verificación

## Resumen del Proyecto

Sistema de envío de códigos de verificación por email para Tecsup Inmersivo.

---

## Arquitectura

```
┌─────────────┐         ┌─────────────┐         ┌──────────────────┐
│   Frontend  │   ───   │   Backend   │   ───   │     Resend API    │
│  (Next.js)  │  llama  │   (NestJS)  │  llama  │   (servicio)      │
└─────────────┘         └─────────────┘         └──────────────────┘
   localhost:3000         localhost:3001
```

---

## Repositorios

| Proyecto | Ubicación | Puerto |
|----------|-----------|--------|
| Frontend (Next.js) | `C:\platform-web` | 3000 |
| Backend (NestJS) | `C:\backend_nest\backend-verification` | 3001 |

---

## Backend - Endpoint

### POST `/auth/send-code`

**Request:**
```json
{
  "email": "anderbstz@gmail.com"
}
```

**Response éxito:**
```json
{
  "success": true,
  "message": "Código de verificación enviado correctamente"
}
```

**Response error:**
```json
{
  "success": false,
  "message": "Error al enviar email: ..."
}
```

---

## Archivos del Backend (NestJS)

### `src/main.ts`
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
```

### `src/auth/auth.controller.ts`
```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

export class SendCodeDto {
  email: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-code')
  async sendCode(@Body() body: SendCodeDto) {
    return this.authService.sendVerificationCode(body.email);
  }
}
```

### `src/auth/auth.service.ts`

Envía email con código de verificación usando Resend. El código está hardcodeado como `847293`.

**Importante:** El `from` debe ser un email del dominio verificado en Resend.

```typescript
from: 'Tecsup Inmersivo <noreply@anderbstz.lat>'  // Cuando dominio esté verificado
```

### `.env`
```
RESEND_API_KEY=re_6kvN6YoK_hvjfZGBV2GF5xc65Smw8yXcV
```

---

## Frontend - GoogleAuthCodeForm

### Ubicación
`src/components/features/auth/GoogleAuthCodeForm.tsx`

### Flujo
1. Usuario ingresa email
2. Click "Enviar código" → `POST http://localhost:3001/auth/send-code`
3. Backend recibe email, llama Resend → email llega al usuario
4. Mostrar toast "Código enviado a tu correo"
5. Mostrar InputOTP para ingresar código
6. Usuario ingresa `847293`
7. Verificación local → redirigir a `/dashboard/student`

### Estados
- `email`: Email del usuario (string vacío inicial)
- `code`: Código de 6 dígitos
- `wasCodeSent`: Controla si mostrar input email o OTP
- `isLoading`: Loading state
- `timeLeft`: Countdown para reenvío (60 segundos)
- `canResend`: Boolean para habilitar botón reenviar

---

## Configuración de Dominio en Resend

### Dominio: `anderbstz.lat`

**Estado:** Por verificar

### Pasos para verificar:
1. Ir a [Resend > Domains](https://resend.com/domains)
2. Click "Add Domain"
3. Ingresar: `anderbstz.lat`
4. Resend dará registros DNS (TXT, MX, CNAME)
5. Ir al panel DNS de donde compraste el dominio
6. Agregar los registros
7. Volver a Resend y click "Verify"

### Después de verificar:
Cambiar en `auth.service.ts` línea 102:
```typescript
// Antes (NO funciona para dominios externos):
from: 'onboarding@resend.com'

// Después (cuando esté verificado anderbstz.lat):
from: 'Tecsup Inmersivo <noreply@anderbstz.lat>'
```

---

## Resend - Limitaciones del Tier Gratuito

| Aspecto | Detalle |
|---------|---------|
| **Dominio no verificado** | Solo puede enviar a emails @resend.dev |
| **Emails externos** | Requiere verificar un dominio propio |
| **Límite de envios** | 100 emails/día en tier gratuito |

---

## Testing

### Probar endpoint directamente:
```bash
curl -X POST http://localhost:3001/auth/send-code -H "Content-Type: application/json" -d "{\"email\":\"anderbstz@gmail.com\"}"
```

### Ver logs del backend:
```bash
cd C:\backend_nest\backend-verification
npm run start:dev
```

---

## Código de Verificación

| Dato | Valor |
|------|-------|
| Código hardcoded | `847293` |
| Duración | 60 segundos (para reenvío) |
| Expiración visual | 10 minutos (mensaje en email) |

---

## Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| "The resend.com domain is not verified" | Dominio no verificado | Verificar `anderbstz.lat` en Resend |
| "Connection refused" | Backend no corriendo | Ejecutar `npm run start:dev` en backend |
| "CORS error" | Frontend y backend puertos distintos | Configurar CORS en main.ts |

---

## Próximos Pasos

1. [ ] Verificar dominio `anderbstz.lat` en Resend
2. [ ] Cambiar `from` en auth.service.ts
3. [ ] Probar envío a `anderbstz@gmail.com`
4. [ ] Implementar endpoint `/auth/verify-code` en backend (para validar código en servidor)
5. [ ] Agregar Google OAuth (login real con Google)

---

## Links Importantes

- [Resend Dashboard](https://resend.com)
- [Documentación Resend](https://resend.com/docs)
- [Agregar Dominio](https://resend.com/domains)