import { describe, it, expect } from 'vitest'
import router from './index'

describe('Router index', () => {
  it('should export a router instance', () => {
    expect(router).toBeDefined()
    expect(router.hasRoute('CompanyMenu')).toBe(true)
    expect(router.hasRoute('CompanyCreate')).toBe(true)
    expect(router.hasRoute('CompanyList')).toBe(true)
    expect(router.hasRoute('CompanyDirectory')).toBe(true)
  })

  it('company list route uses /companies', () => {
    const r = router.getRoutes().find((x) => x.name === 'CompanyList')
    expect(r).toBeDefined()
    expect(r?.path).toBe('/companies')
  })
})
