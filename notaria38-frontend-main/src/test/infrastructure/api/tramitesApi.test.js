import { fetchTramites, fetchTramiteDetalle } from '../../../infrastructure/api/tramitesApi';

describe('tramitesApi', () => {
    beforeEach(() => {
        global.fetch = jest.fn(); // Mock de fetch
    });

    // Pruebas para fetchTramites
    describe('fetchTramites', () => {
        it('debe retornar trámites cuando la API responde correctamente', async () => {
            const mockTramites = [{ ID_Tramite: 1, Titulo: 'Trámite 1' }];
            fetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ tramites: mockTramites }) });

            const result = await fetchTramites();
            expect(result).toEqual(mockTramites);
        });

        it('debe lanzar error si VITE_API_URL no está definida', async () => {
            const originalEnv = import.meta.env.VITE_API_URL;
            import.meta.env.VITE_API_URL = '';
            await expect(fetchTramites()).rejects.toThrow('VITE_API_URL no definida');
            import.meta.env.VITE_API_URL = originalEnv;
        });
    });

    // Pruebas para fetchTramiteDetalle
    describe('fetchTramiteDetalle', () => {
        it('debe retornar el detalle de un trámite', async () => {
            const mockDetalle = { ID_Tramite: 1, Descripcion: 'Detalle' };
            fetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ tramites: [mockDetalle] }) });

            const result = await fetchTramiteDetalle(1);
            expect(result).toEqual(mockDetalle);
        });
    });
});