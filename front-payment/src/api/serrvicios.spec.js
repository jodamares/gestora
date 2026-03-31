import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as apiIndex from './index.js'
import { getCompanies } from './serrvicios.js'

vi.mock('./index.js', () => ({
  request: vi.fn(),
}))

describe('api/serrvicios', () => {
  beforeEach(() => {
    vi.mocked(apiIndex.request).mockReset()
  })

  it('getCompanies calls request with companies URL', async () => {
    apiIndex.request.mockResolvedValueOnce([{ id: 1, name: 'C1' }])

    const result = await getCompanies()

    expect(apiIndex.request).toHaveBeenCalledWith(expect.stringContaining('companies'))
    expect(result).toEqual([{ id: 1, name: 'C1' }])
  })
})
