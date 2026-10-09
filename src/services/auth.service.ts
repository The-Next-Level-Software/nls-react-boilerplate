import { appConfig, useMockApi } from '@/config/app.config'
import { useAuthStore } from '@/store/auth.store'
import type { AuthUser } from '@/types'
import { ApiError, delay, http } from './http'

export interface LoginPayload {
  email: string
  password: string
  remember: boolean
}

interface LoginResponse {
  user: AuthUser
  token: string
}

const mockUser: AuthUser = {
  id: 'u_admin',
  name: 'Alex Morgan',
  email: appConfig.demoCredentials.email,
  role: 'admin',
  avatar: null,
}

export const authService = {
  async login({ email, password, remember }: LoginPayload) {
    let session: LoginResponse
    if (useMockApi) {
      await delay(600)
      const { demoCredentials } = appConfig
      if (email.toLowerCase() !== demoCredentials.email || password !== demoCredentials.password) {
        throw new ApiError(401, 'Invalid email or password')
      }
      session = { user: mockUser, token: 'mock-token' }
    } else {
      session = await http.post<LoginResponse>('/auth/login', { email, password })
    }
    useAuthStore.getState().setSession(session, remember)
    return session.user
  },

  async logout() {
    if (!useMockApi) await http.post('/auth/logout').catch(() => undefined)
    useAuthStore.getState().clear()
  },

  async requestPasswordReset(email: string) {
    if (useMockApi) return delay(600)
    await http.post('/auth/forgot-password', { email })
  },

  async updateProfile(patch: Partial<Pick<AuthUser, 'name' | 'email' | 'avatar'>>) {
    if (useMockApi) await delay()
    else await http.patch('/me', patch)
    useAuthStore.getState().updateUser(patch)
  },

  async changePassword(payload: { currentPassword: string; newPassword: string }) {
    if (useMockApi) {
      await delay()
      if (payload.currentPassword !== appConfig.demoCredentials.password) {
        throw new ApiError(422, 'Current password is incorrect')
      }
      return
    }
    await http.post('/me/password', payload)
  },
}
