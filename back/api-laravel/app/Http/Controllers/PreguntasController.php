<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Preguntas;

class PreguntasController extends Controller
{
    public function index()
    {
        return Preguntas::all();
    }
    public function afegir(Request $request)
    {
        $request->validate([
            'pregunta' => 'required|string|max:255',
            'usuario' => 'required|string',
        ]);
        $pregunta = new Preguntas();
        $pregunta->pregunta = $request->pregunta;
        $pregunta->usuario = $request->usuario;
        $pregunta->save();
        return response()->json([
            'status' => 1,
            'message' => 'Pregunta afegida correctament'
        ]);
    }
    public function getPreguntasRandom()
    {
        $preguntasIds = Preguntas::inRandomOrder()->take(50)->distinct()->pluck('id_pregunta');


        $preguntas = Preguntas::whereIn('id_pregunta', $preguntasIds)->get();

        return response()->json([
            'status' => 1,
            'preguntas' => $preguntas
        ]);
    }
    public function getCountPreguntas()
    {
        $count = Preguntas::count();

        return response()->json([
            'status' => 1,
            'count' => $count
        ]);
    }
    public function updatePregunta(Request $request, $id)
    {
        $request->validate([
            'pregunta' => 'required|string|max:255',
            'usuario' => 'required|string',
        ]);
        $pregunta = Preguntas::findOrFail($id);
        $pregunta->pregunta = $request->pregunta;
        $pregunta->usuario = $request->usuario;
        $pregunta->save();

        return response()->json([
            'status' => 1,
            'message' => 'Pregunta actualizada correctamente'
        ]);

        return response()->json([
            'status' => 0,
            'message' => 'Error al actualizar la pregunta',
        ]);
    }
    public function deletePregunta($id)
    {

        $pregunta = Preguntas::findOrFail($id);
        $pregunta->delete();

        return response()->json([
            'status' => 1,
            'message' => 'Pregunta eliminada correctamente'
        ]);

        return response()->json([
            'status' => 0,
            'message' => 'Error al eliminar la pregunta',
        ]);
    }
    public function validarPregunta($id)
    {
        $pregunta = Preguntas::find($id);

        if ($pregunta) {
            if ($pregunta->activo) {
                return response()->json([
                    'status' => 1,
                    'pregunta' => $pregunta,
                    'message' => 'La pregunta está activa',
                ]);
            } else {
                return response()->json([
                    'status' => 0,
                    'message' => 'La pregunta no está activa',
                ]);
            }
        } else {
            return response()->json([
                'status' => 0,
                'message' => 'No se encontró la pregunta',
            ]);
        }
    }





}

