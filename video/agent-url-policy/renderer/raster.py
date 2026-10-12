import ctypes as C, pathlib, time, sys
r=C.CDLL('librsvg-2.so.2');c=C.CDLL('libcairo.so.2');g=C.CDLL('libgobject-2.0.so.0')
r.rsvg_handle_new_from_data.argtypes=[C.c_char_p,C.c_size_t,C.c_void_p];r.rsvg_handle_new_from_data.restype=C.c_void_p
r.rsvg_handle_render_cairo.argtypes=[C.c_void_p,C.c_void_p];r.rsvg_handle_render_cairo.restype=C.c_int
c.cairo_image_surface_create.argtypes=[C.c_int,C.c_int,C.c_int];c.cairo_image_surface_create.restype=C.c_void_p
c.cairo_create.argtypes=[C.c_void_p];c.cairo_create.restype=C.c_void_p
c.cairo_scale.argtypes=[C.c_void_p,C.c_double,C.c_double]
c.cairo_surface_write_to_png.argtypes=[C.c_void_p,C.c_char_p];c.cairo_surface_write_to_png.restype=C.c_int
c.cairo_destroy.argtypes=[C.c_void_p];c.cairo_surface_destroy.argtypes=[C.c_void_p];g.g_object_unref.argtypes=[C.c_void_p]
def raster(src,dest,width=800,height=720,source_width=800,source_height=720):
 data=pathlib.Path(src).read_bytes();h=r.rsvg_handle_new_from_data(data,len(data),None)
 if not h:raise RuntimeError('SVG parse failed')
 surf=c.cairo_image_surface_create(0,width,height);ctx=c.cairo_create(surf);c.cairo_scale(ctx,width/source_width,height/source_height)
 if not r.rsvg_handle_render_cairo(h,ctx):raise RuntimeError('SVG rendering failed')
 code=c.cairo_surface_write_to_png(surf,str(dest).encode())
 c.cairo_destroy(ctx);c.cairo_surface_destroy(surf);g.g_object_unref(h)
 if code:raise RuntimeError('PNG failed '+str(code))
if __name__=='__main__':
 t=time.time();raster(*sys.argv[1:3]);print('seconds',time.time()-t)
