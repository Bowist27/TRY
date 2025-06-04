import { render, screen, fireEvent } from '@testing-library/react';
import TramiteCard from './TramiteCard';

describe('TramiteCard', () => {
  const mockTramite = {
    ID_Tramite: 1,
    Titulo: 'Licencia de conducir',
    Descripcion: 'Trámite para obtener tu licencia.',
  };

  it('renderiza correctamente título y descripción', () => {
    render(
      <TramiteCard
        tramite={mockTramite}
        onSelect={() => {}}
      />
    );

    expect(
      screen.getByText(/Licencia de conducir/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Trámite para obtener tu licencia/i)
    ).toBeInTheDocument();
  });

  it('llama a onSelect con el ID al hacer clic', () => {
    const onSelect = jest.fn();

    render(
      <TramiteCard
        tramite={mockTramite}
        onSelect={onSelect}
      />
    );

    fireEvent.click(
      screen.getByText(/Licencia de conducir/i)
    );

    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it('aplica estilo si está seleccionado', () => {
    const { container } = render(
      <TramiteCard
        tramite={mockTramite}
        onSelect={() => {}}
        isSelected={true}
      />
    );

    expect(container.firstChild).toHaveClass('bg-orange-100');
  });
});
