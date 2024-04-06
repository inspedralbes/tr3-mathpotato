<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\Usuarios;
use Illuminate\Support\Facades\Hash;

class usuariosController extends Controller
{
    public function register(Request $request)
    {
        try {
            $validator = $request->validate([
                'username' => 'required|string|max:50',
                'email' => 'required|string|email|unique:usuarios',
                'password' => 'required|string|min:6|confirmed',
                'foto_perfil' => [
                    'required',
                    Rule::in(['1', '2', '3', '4', '5', '6', '7', '8', '9']),
                ],
            ]);

            if ($validator) {
                $usuario = new Usuarios();
                $usuario->username = $request->username;
                $usuario->email = $request->email;
                $usuario->password = Hash::make($request->password);
                $usuario->foto_perfil = $request->foto_perfil;

                $usuario->save();

                $token = $usuario->createToken('myapptoken')->plainTextToken;

                return response()->json([
                    'status' => 1,
                    'message' => 'usuari creat correctament',
                    'token' => $token,
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'message' => 'error al crear usuari'
            ]);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string|min:6',
        ]);

        // Cambia la línea siguiente para asignar el resultado de la consulta a $usuario
        $usuario = Usuarios::where("email", "=", $request->email)->first();

        if ($usuario) {
            if (Hash::check($request->password, $usuario->password)) {
                $token = $usuario->createToken('myapptoken')->plainTextToken;

                return response()->json([
                    'status' => 1,
                    'username' => $usuario->username,
                    'email' => $usuario->email,
                    'foto_perfil' => $usuario->foto_perfil,
                    'tutorial' => $usuario->tutorial,
                    'message' => 'Usuario logeado correctamente',
                    'token' => $token
                ]);
            } else {
                return response()->json([
                    'status' => 0,
                    'message' => 'Contrasenya incorrecta'
                ]);
            }
        } else {
            return response()->json([
                'status' => 0,
                'message' => 'usuario no registrat'
            ]);
        }
    }
    public function logout(Request $request)
    {
        auth()->user()->tokens()->delete();

        return response()->json([
            'status' => 1,
            'message' => 'Sesión cerrada correctamente'
        ]);
    }
    public function changeProfile(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:50',
            'foto_perfil' => [
                'required',
                Rule::in(['1', '2', '3', '4', '5', '6', '7', '8', '9']),
            ],
        ]);

        $usuario = Usuarios::where("email", "=", $request->email)->first();
        $usuario->username = $request->username;
        $usuario->foto_perfil = $request->foto_perfil;

        $usuario->save();

        return response()->json([
            'status' => 1,
            'username' => $usuario->username,
            'foto_perfil' => $usuario->foto_perfil,

        ]);
    }

    public function ranking()
    {
        $usuarios = Usuarios::orderBy('num_victorias', 'desc')->limit(20)->get();

        foreach ($usuarios as $usuario) {
            $totalGames = $usuario->num_victorias + $usuario->num_derrotas;
            $usuario->victory_percentage = $totalGames > 0 ? ($usuario->num_victorias / $totalGames) * 100 : 0;
        }

        // Sort by victory percentage
        $usuarios = $usuarios->sortByDesc('victory_percentage');

        return response()->json([
            'ranking' => $usuarios->values() // Reset keys after sorting
        ]);
    }

    public function updateDerrotas(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
        ]);

        $usuario = Usuarios::where("email", "=", $request->email)->first();
        if ($usuario->tutorial == 1) {
            $usuario->tutorial = 0;
        }
        $usuario->num_derrotas = $usuario->num_derrotas + 1;
        $usuario->save();
        return response()->json([
            'status' => 1,
            'num_derrotas' => $usuario->num_derrotas
        ]);
    }

    public function updateVictorias(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
        ]);
        $usuario = Usuarios::where("email", "=", $request->email)->first();
        if ($usuario->tutorial == 1) {
            $usuario->tutorial = 0;
        }
        $usuario->num_victorias = $usuario->num_victorias + 1;
        $usuario->save();
        return response()->json([
            'status' => 1,
            'num_victorias' => $usuario->num_victorias
        ]);
    }
}
