<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSoftwareRequest;
use App\Http\Requests\Admin\UpdateSoftwareRequest;
use App\Http\Resources\SoftwareResource;
use App\Models\Software;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class SoftwareController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', Software::class);

        return Inertia::render('admin/softwares/index', [
            'softwares' => SoftwareResource::collection(
                Software::query()->withCount('tickets')->orderBy('name')->get()
            ),
        ]);
    }

    public function store(StoreSoftwareRequest $request): RedirectResponse
    {
        Software::create($request->safe()->only(['name', 'slug', 'description', 'color', 'is_active']));

        return back()->with('success', 'Software registrado.');
    }

    public function update(UpdateSoftwareRequest $request, Software $software): RedirectResponse
    {
        $software->update($request->safe()->only(['name', 'slug', 'description', 'color', 'is_active']));

        return back()->with('success', 'Software actualizado.');
    }

    public function destroy(Software $software): RedirectResponse
    {
        Gate::authorize('delete', $software);

        if ($software->tickets()->exists()) {
            return back()->with('error', 'No se puede eliminar un software con tickets asociados. Desactívalo en su lugar.');
        }

        $software->delete();

        return back()->with('success', 'Software eliminado.');
    }
}
