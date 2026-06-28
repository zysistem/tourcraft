'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
})

type Form = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: Form) => {
    setError('')
    const res = await signIn('credentials', { ...data, redirect: false })
    if (res?.error) {
      setError('Invalid email or password')
    } else {
      router.push('/admin/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-[42px] h-[42px] rounded-[11px] flex items-center justify-center text-[#3a2a14] font-black text-[20px]"
            style={{ background: 'linear-gradient(135deg, #b08147, #cda06a)' }}>T</div>
          <div>
            <div className="text-ink font-bold text-[20px]">TourCraft</div>
            <div className="text-[11px] text-muted tracking-widest uppercase">Tour Studio</div>
          </div>
        </div>

        <div className="bg-card border border-line rounded-[16px] p-8 shadow-sm">
          <h1 className="text-[22px] font-bold mb-1">Sign in</h1>
          <p className="text-[13px] text-muted mb-6">Enter your credentials to access the admin panel.</p>

          {error && (
            <div className="bg-red-soft border border-red/30 text-red text-[13px] rounded-[9px] px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-[12.5px] font-semibold block mb-[7px]">Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@company.com"
                className="w-full h-[42px] border border-line rounded-[9px] px-[13px] text-[14px] outline-none focus:border-navy transition-colors"
              />
              {errors.email && <p className="text-red text-[12px] mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-[12.5px] font-semibold block mb-[7px]">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full h-[42px] border border-line rounded-[9px] px-[13px] pr-10 text-[14px] outline-none focus:border-navy transition-colors"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-muted">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red text-[12px] mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[42px] bg-navy text-white rounded-[9px] font-semibold text-[14px] flex items-center justify-center gap-2 hover:bg-navy2 transition-colors disabled:opacity-60">
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" />Signing in…</> : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-[12px] text-faint mt-4">TourCraft Admin · Secure access</p>
      </div>
    </div>
  )
}
