import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  createEvent,
  deleteEvent,
  getAllEventsAdmin,
  getPublicEvents,
  registerEventClick,
  toggleEventFeatured,
  toggleEventStatus,
  updateEvent,
  uploadEventImage,
} from '../services/events.service'
import {
  getSiteSettings,
  updateSiteSettings,
} from '../services/settings.service'
import type { EventItem, SiteSettings } from '../types/database'

import {
  generateUniqueStoragePath,
  uploadStorageFile,
  deleteStorageFile,
} from '../services/storage.service'
import {
  findEventById,
} from '../services/events.repository'

function createMockSupabase(overrides: Partial<any> = {}): SupabaseClient {
  return overrides as unknown as SupabaseClient
}

describe('Services: Events & Settings', () => {
  it('getPublicEvents queries active events sorted correctly', async () => {
    const mockEvents: EventItem[] = [
      {
        id: '123',
        title: 'Festival Rock',
        description: 'Concierto',
        external_link: 'https://example.com/tickets',
        image_url: 'https://example.com/flyer.webp',
        image_path: 'flyers/flyer.webp',
        event_date: '2026-11-01T20:00:00Z',
        location: 'Estadio',
        category: 'Musica',
        is_featured: true,
        is_active: true,
        clicks_count: 5,
        sort_order: 1,
        created_at: '2026-10-15T00:00:00Z',
        updated_at: '2026-10-15T00:00:00Z',
      },
    ]

    const chain = {
      select: () => chain,
      eq: () => chain,
      order: () => chain,
      then: (resolve: (value: { data: EventItem[]; error: null }) => void) => {
        resolve({ data: mockEvents, error: null })
      },
    }

    const mockClient = createMockSupabase({
      from: (table: string) => {
        assert.equal(table, 'events')
        return chain
      },
    })

    const result = await getPublicEvents(mockClient)
    assert.deepEqual(result, mockEvents)
  })

  it('getAllEventsAdmin queries all events sorted by created_at desc', async () => {
    let orderField = ''
    let orderAscending = true

    const chain = {
      select: () => chain,
      order: (field: string, options: { ascending: boolean }) => {
        orderField = field
        orderAscending = options.ascending
        return Promise.resolve({ data: [], error: null })
      },
    }

    const mockClient = createMockSupabase({
      from: (table: string) => {
        assert.equal(table, 'events')
        return chain
      },
    })

    const result = await getAllEventsAdmin(mockClient)
    assert.equal(orderField, 'created_at')
    assert.equal(orderAscending, false)
    assert.deepEqual(result, [])
  })

  it('uploadEventImage generates a clean flyer path and calls storage.upload with webp', async () => {
    let uploadedBucket = ''
    let uploadedPath = ''
    let uploadedContentType = ''

    const fakeFile = new File(['dummy-content'], 'Mi Evento 2026!.png', {
      type: 'image/png',
    })

    const mockClient = createMockSupabase({
      storage: {
        from: (bucket: string) => {
          uploadedBucket = bucket
          return {
            upload: (path: string, _file: unknown, options?: { contentType?: string }) => {
              uploadedPath = path
              uploadedContentType = options?.contentType || ''
              return Promise.resolve({ error: null })
            },
            getPublicUrl: (path: string) => ({
              data: { publicUrl: `https://mock.supabase.co/storage/v1/object/public/${bucket}/${path}` },
            }),
          }
        },
      },
    })

    const result = await uploadEventImage(fakeFile, mockClient)
    assert.equal(uploadedBucket, 'event-images')
    assert.match(uploadedPath, /^flyers\/\d+-[a-z0-9]+-mi_evento_2026_\.webp$/)
    assert.equal(uploadedContentType, 'image/webp')
    assert.ok(result.image_url.includes(uploadedPath))
    assert.equal(result.image_path, uploadedPath)
  })

  it('createEvent rolls back uploaded image if database insert fails', async () => {
    let removedPath = ''

    const fakeFile = new File(['content'], 'test.webp', { type: 'image/webp' })

    const mockClient = createMockSupabase({
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ error: null }),
          getPublicUrl: (path: string) => ({ data: { publicUrl: `https://mock.co/${path}` } }),
          remove: (paths: string[]) => {
            removedPath = paths[0]
            return Promise.resolve({ error: null })
          },
        }),
      },
      from: () => ({
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: { message: 'Database insert failed' } }),
          }),
        }),
      }),
    })

    await assert.rejects(
      () =>
        createEvent(
          {
            title: 'Test Event',
            external_link: 'https://link.com',
            imageFile: fakeFile,
          },
          mockClient
        ),
      /Database insert failed/
    )

    assert.match(removedPath, /^flyers\//)
  })

  it('toggleEventStatus and toggleEventFeatured update proper columns', async () => {
    let updatedPayload: Record<string, unknown> = {}

    const mockClient = createMockSupabase({
      from: () => ({
        update: (payload: Record<string, unknown>) => {
          updatedPayload = payload
          return {
            eq: () => ({
              select: () => ({
                single: () => Promise.resolve({ data: { id: 'evt-1', ...payload }, error: null }),
              }),
            }),
          }
        },
      }),
    })

    await toggleEventStatus('evt-1', false, mockClient)
    assert.equal(updatedPayload.is_active, false)

    await toggleEventFeatured('evt-1', true, mockClient)
    assert.equal(updatedPayload.is_featured, true)
  })

  it('registerEventClick invokes the increment_event_click RPC function', async () => {
    let calledRpc = ''
    let calledArgs: Record<string, unknown> = {}

    const mockClient = createMockSupabase({
      rpc: (fn: string, args: Record<string, unknown>) => {
        calledRpc = fn
        calledArgs = args
        return Promise.resolve({ error: null })
      },
    })

    await registerEventClick('evt-click-123', mockClient)
    assert.equal(calledRpc, 'increment_event_click')
    assert.equal(calledArgs.event_id, 'evt-click-123')
  })

  it('deleteEvent removes image from bucket and deletes row from table', async () => {
    let removedBucketPath = ''
    let deletedId = ''

    const mockClient = createMockSupabase({
      storage: {
        from: () => ({
          remove: (paths: string[]) => {
            removedBucketPath = paths[0]
            return Promise.resolve({ error: null })
          },
        }),
      },
      from: () => ({
        delete: () => ({
          eq: (column: string, val: string) => {
            if (column === 'id') deletedId = val
            return Promise.resolve({ error: null })
          },
        }),
      }),
    })

    await deleteEvent('evt-del-1', 'flyers/old-photo.webp', mockClient)
    assert.equal(removedBucketPath, 'flyers/old-photo.webp')
    assert.equal(deletedId, 'evt-del-1')
  })

  it('getSiteSettings and updateSiteSettings operate on id = 1', async () => {
    let queryTargetId = 0
    let updateTargetId = 0

    const mockSettings: SiteSettings = {
      id: 1,
      hero_title: 'Próximos Eventos',
      hero_subtitle: 'Los mejores shows',
      hero_bg_url: null,
      cta_text: 'Comprar entradas',
      instagram_url: null,
      whatsapp_number: null,
      updated_at: '2026-10-15T00:00:00Z',
    }

    const mockClient = createMockSupabase({
      from: () => ({
        select: () => ({
          eq: (col: string, val: number) => {
            queryTargetId = val
            return {
              single: () => Promise.resolve({ data: mockSettings, error: null }),
            }
          },
        }),
        update: (payload: Record<string, unknown>) => ({
          eq: (col: string, val: number) => {
            updateTargetId = val
            return {
              select: () => ({
                single: () => Promise.resolve({ data: { ...mockSettings, ...payload }, error: null }),
              }),
            }
          },
        }),
      }),
    })

    const fetched = await getSiteSettings(mockClient)
    assert.equal(queryTargetId, 1)
    assert.equal(fetched.hero_title, 'Próximos Eventos')

    const updated = await updateSiteSettings({ hero_title: 'Cartelera Actualizada' }, mockClient)
    assert.equal(updateTargetId, 1)
    assert.equal(updated.hero_title, 'Cartelera Actualizada')
  })

  it('generateUniqueStoragePath formats folder, timestamp and clean filename', () => {
    const path = generateUniqueStoragePath('Foto Con Espacios & Tildes.jpeg', 'flyers')
    assert.match(path, /^flyers\/\d+-[a-z0-9]+-foto_con_espacios___tildes\.jpeg$/)
  })

  it('findEventById queries events table using maybeSingle', async () => {
    let queriedId = ''

    const mockClient = createMockSupabase({
      from: (table: string) => {
        assert.equal(table, 'events')
        return {
          select: () => ({
            eq: (col: string, val: string) => {
              if (col === 'id') queriedId = val
              return {
                maybeSingle: () => Promise.resolve({ data: { id: val, title: 'Single Event' }, error: null }),
              }
            },
          }),
        }
      },
    })

    const event = await findEventById('evt-find-999', mockClient)
    assert.equal(queriedId, 'evt-find-999')
    assert.equal(event?.title, 'Single Event')
  })
})

