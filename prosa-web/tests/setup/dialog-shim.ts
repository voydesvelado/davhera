/**
 * jsdom no implementa `<dialog>`: `showModal` directamente no existe.
 *
 * Este shim le da lo mínimo para que los tests de UI puedan abrir y cerrar
 * diálogos. **No reemplaza lo que el navegador aporta de verdad**: la trampa de
 * foco, el fondo inerte, el top-layer y el Escape nativo NO quedan verificados por
 * los tests — son justamente las razones por las que se eligió `<dialog>` sobre
 * Radix, y solo se pueden comprobar en un navegador real.
 *
 * Lo que sí queda cubierto acá es el comportamiento propio: que abra, que cierre
 * al pedirlo, que el evento `close` avise, y que un click en el backdrop cierre.
 */
if (typeof HTMLDialogElement !== "undefined" && !HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.open = true;
  };
  HTMLDialogElement.prototype.show = function show(this: HTMLDialogElement) {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function close(
    this: HTMLDialogElement,
    returnValue?: string,
  ) {
    if (!this.open) return;
    this.open = false;
    if (returnValue !== undefined) this.returnValue = returnValue;
    this.dispatchEvent(new Event("close"));
  };
}

export {};
