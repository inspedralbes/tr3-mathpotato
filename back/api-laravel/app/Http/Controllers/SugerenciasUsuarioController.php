<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sugerencias;
use App\Models\Usuarios;

class SugerenciasUsuarioController extends Controller
{
    //
    public function createSugerencia(Request $request)
    {

        $validator = $request->validate([
            'sugerencia' => 'required|string|max:255',
            'usuario_email' => 'required|string|email',
        ]);

        if ($validator) {

            $usuario = Usuarios::where("email", "=", $request->usuario_email)->first();
            
            if ($usuario) {
                $sugerencia = new Sugerencias();
                $sugerencia->sugerencia = $request->sugerencia;
                $sugerencia->usuario_email = $request->usuario_email;

                $sugerencia->save();
                
                return response()->json([
                    'status' => 1,
                    'message' => 'sugerencia creada correctamente',
                ]);
            } else {
                return response()->json([
                    'status' => 0,
                    'message' => 'El email no existe',
                ]);
            }
        }
    }
}
